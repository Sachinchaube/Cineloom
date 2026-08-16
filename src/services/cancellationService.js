// Booking Cancellation & Refund Engine
import { storageService } from './storageService';
import { showService } from './showService';
import { bookingService, BookingStatus, PaymentStatus } from './bookingService';
import { loggerService } from './loggerService';

export const cancellationService = {
  getCancellationPolicy() {
    return storageService.get(storageService.KEYS.POLICY) || {
      rules: [
        { hoursBeforeShow: 2.0, refundPercentage: 80 },
        { hoursBeforeShow: 1.0, refundPercentage: 50 },
        { hoursBeforeShow: 0, refundPercentage: 0 }
      ],
      convenienceFeeRefundable: false
    };
  },

  calculateHoursUntilShow(showDateStr, showTimeStr) {
    if (!showDateStr || !showTimeStr) return -1;
    
    // Parse show datetime
    const [time, period] = showTimeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    const showDateTime = new Date(`${showDateStr}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`);
    const now = new Date();

    const diffMillis = showDateTime.getTime() - now.getTime();
    return diffMillis / (1000 * 60 * 60); // In hours
  },

  evaluateCancellationEligibility(bookingId) {
    const booking = bookingService.getBookingById(bookingId);
    if (!booking) {
      return { eligible: false, message: 'Booking not found.' };
    }

    if (booking.bookingStatus === BookingStatus.CANCELLED || booking.bookingStatus === BookingStatus.REFUNDED) {
      return { eligible: false, message: 'This booking has already been cancelled.' };
    }

    const hoursUntilShow = this.calculateHoursUntilShow(booking.showDate, booking.showTime);
    
    // For demo flexibility: if show is on same day or upcoming
    let refundPercentage = 0;
    let tierDescription = '';

    if (hoursUntilShow >= 2.0) {
      refundPercentage = 80;
      tierDescription = 'Eligible for 80% refund of base ticket price (more than 2 hours before showtime)';
    } else if (hoursUntilShow >= 1.0) {
      refundPercentage = 50;
      tierDescription = 'Eligible for 50% refund of base ticket price (between 1 and 2 hours before showtime)';
    } else if (hoursUntilShow > 0) {
      refundPercentage = 0;
      tierDescription = 'Less than 1 hour before showtime: cancellation permitted without monetary refund';
    } else {
      return {
        eligible: false,
        hoursUntilShow,
        message: 'Show has already commenced or concluded. Cancellation is no longer permitted.'
      };
    }

    const baseRefundableAmount = booking.subtotal - (booking.discountAmount || 0);
    const refundAmount = Number(((baseRefundableAmount * refundPercentage) / 100).toFixed(2));
    const nonRefundableAmount = Number((booking.totalAmount - refundAmount).toFixed(2));

    return {
      eligible: true,
      booking,
      hoursUntilShow: Number(hoursUntilShow.toFixed(1)),
      refundPercentage,
      refundAmount,
      nonRefundableAmount,
      convenienceFeeRetained: booking.convenienceFee,
      tierDescription
    };
  },

  processCancellation(bookingId, cancellationReason = 'Customer requested cancellation') {
    const evaluation = this.evaluateCancellationEligibility(bookingId);
    if (!evaluation.eligible) {
      throw new Error(evaluation.message);
    }

    const booking = evaluation.booking;
    const shows = showService.getAllShows();
    const showIdx = shows.findIndex(s => s.id === booking.showId);

    // Free up seats
    if (showIdx !== -1) {
      const show = shows[showIdx];
      const releasedSeats = booking.seats.map(s => s.seatNumber);
      show.bookedSeats = (show.bookedSeats || []).filter(seatNum => !releasedSeats.includes(seatNum));
      shows[showIdx] = show;
      storageService.set(storageService.KEYS.SHOWS, shows);
      loggerService.info('SEATS_RELEASED_AFTER_CANCELLATION', {
        showId: show.id,
        seats: releasedSeats
      });
    }

    // Update booking record
    const bookings = bookingService.getAllBookings();
    const bookingIdx = bookings.findIndex(b => b.id === bookingId);
    if (bookingIdx !== -1) {
      const updatedBooking = {
        ...bookings[bookingIdx],
        bookingStatus: BookingStatus.REFUNDED,
        cancellation: {
          cancelledAt: new Date().toISOString(),
          reason: cancellationReason,
          refundAmount: evaluation.refundAmount,
          refundPercentage: evaluation.refundPercentage,
          refundStatus: PaymentStatus.REFUNDED,
          refundReference: `REF-${Date.now()}`
        }
      };

      bookings[bookingIdx] = updatedBooking;
      storageService.set(storageService.KEYS.BOOKINGS, bookings);

      loggerService.audit('BOOKING_CANCELLED_AND_REFUNDED', {
        bookingId,
        reference: booking.bookingReference,
        refundAmount: evaluation.refundAmount,
        refundPercentage: evaluation.refundPercentage
      });

      return updatedBooking;
    }

    throw new Error('Failed to update booking status.');
  }
};

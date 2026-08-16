// Booking & Mock Payment Service
import { storageService } from './storageService';
import { showService } from './showService';
import { pricingService } from './pricingService';
import { loggerService } from './loggerService';

export const PaymentStatus = {
  PENDING: 'PENDING',
  SUCCESSFUL: 'SUCCESSFUL',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED'
};

export const BookingStatus = {
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
  REFUND_PENDING: 'REFUND_PENDING',
  REFUNDED: 'REFUNDED'
};

export const bookingService = {
  getAllBookings() {
    return storageService.get(storageService.KEYS.BOOKINGS) || [];
  },

  getUserBookings(userId) {
    const bookings = this.getAllBookings();
    return bookings.filter(b => b.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getBookingByReference(ref) {
    const bookings = this.getAllBookings();
    return bookings.find(b => b.bookingReference.toUpperCase() === ref.trim().toUpperCase()) || null;
  },

  getBookingById(id) {
    const bookings = this.getAllBookings();
    return bookings.find(b => b.id === id) || null;
  },

  generateReferenceNumber() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `CNL-${code}`;
  },

  async processMockPayment(paymentData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (paymentData.simulateFailure) {
      return {
        status: PaymentStatus.FAILED,
        paymentId: `pay-fail-${Date.now()}`,
        errorMessage: 'Card declined by issuing bank or insufficient funds.'
      };
    }

    return {
      status: PaymentStatus.SUCCESSFUL,
      paymentId: `pay-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      method: paymentData.method || 'CARD',
      cardLast4: paymentData.cardNumber ? paymentData.cardNumber.slice(-4) : '8821',
      upiId: paymentData.upiId || null,
      timestamp: new Date().toISOString()
    };
  },

  async createBooking({
    user,
    showId,
    selectedSeats,
    couponCode = null,
    paymentMethod = 'CARD',
    paymentDetails = {}
  }) {
    if (!user || !user.id) {
      throw new Error('User authentication required for booking.');
    }

    if (!selectedSeats || !selectedSeats.length) {
      throw new Error('No seats selected.');
    }

    const show = showService.getShowById(showId);
    if (!show || !show.isActive) {
      throw new Error('Selected show is unavailable or inactive.');
    }

    // Verify seat availability
    const bookedSet = new Set(show.bookedSeats || []);
    const lockedMap = show.lockedSeats || {};
    for (const seat of selectedSeats) {
      if (bookedSet.has(seat.seatNumber)) {
        throw new Error(`Seat ${seat.seatNumber} has already been booked by another customer.`);
      }
      if (lockedMap[seat.seatNumber] && lockedMap[seat.seatNumber].userId !== user.id) {
        throw new Error(`Seat ${seat.seatNumber} is currently reserved by another customer.`);
      }
    }

    // Calculate verified price
    const pricing = pricingService.calculateBookingPrice({
      showId,
      selectedSeats,
      couponCode
    });

    // Execute payment
    const paymentResult = await this.processMockPayment({
      method: paymentMethod,
      amount: pricing.totalAmount,
      ...paymentDetails
    });

    if (paymentResult.status !== PaymentStatus.SUCCESSFUL) {
      loggerService.warn('PAYMENT_FAILED', {
        userId: user.id,
        showId,
        amount: pricing.totalAmount,
        reason: paymentResult.errorMessage
      });
      throw new Error(paymentResult.errorMessage || 'Payment transaction failed. Please try again.');
    }

    // Transition seats from locked to booked in the show
    const shows = showService.getAllShows();
    const showIdx = shows.findIndex(s => s.id === showId);
    if (showIdx !== -1) {
      const currentShow = shows[showIdx];
      const newBookedSeats = [...(currentShow.bookedSeats || [])];
      const currentLocked = { ...(currentShow.lockedSeats || {}) };

      selectedSeats.forEach(s => {
        if (!newBookedSeats.includes(s.seatNumber)) {
          newBookedSeats.push(s.seatNumber);
        }
        delete currentLocked[s.seatNumber];
      });

      currentShow.bookedSeats = newBookedSeats;
      currentShow.lockedSeats = currentLocked;
      shows[showIdx] = currentShow;
      storageService.set(storageService.KEYS.SHOWS, shows);
    }

    // Create booking record
    const booking = {
      id: `bkg-${Date.now()}`,
      bookingReference: this.generateReferenceNumber(),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      showId: show.id,
      movieId: show.movieId,
      movieTitle: show.movieTitle,
      theatreId: show.theatreId,
      theatreName: show.theatreName,
      screenName: show.screenName,
      format: show.format,
      showDate: show.date,
      showTime: show.startTime,
      seats: pricing.seatsBreakdown,
      seatCount: pricing.seatCount,
      subtotal: pricing.subtotal,
      discountAmount: pricing.discountAmount,
      appliedCoupon: pricing.couponApplied ? pricing.couponApplied.code : null,
      convenienceFee: pricing.convenienceFee,
      taxAmount: pricing.taxAmount,
      totalAmount: pricing.totalAmount,
      payment: paymentResult,
      bookingStatus: BookingStatus.CONFIRMED,
      createdAt: new Date().toISOString()
    };

    const bookings = this.getAllBookings();
    bookings.unshift(booking);
    storageService.set(storageService.KEYS.BOOKINGS, bookings);

    loggerService.audit('BOOKING_CONFIRMED', {
      bookingId: booking.id,
      reference: booking.bookingReference,
      userId: user.id,
      amount: booking.totalAmount,
      seatCount: booking.seatCount
    });

    return booking;
  }
};

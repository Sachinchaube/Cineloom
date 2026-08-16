import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { seatService } from '../services/seatService';
import { pricingService } from '../services/pricingService';
import { bookingService } from '../services/bookingService';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

const BookingContext = createContext();

export function BookingProvider({ children }) {
  const { currentUser, openLoginModal } = useAuth();
  const { showSuccess, showError, showWarning, showInfo } = useNotification();

  // Booking Flow States
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [pricingBreakdown, setPricingBreakdown] = useState(null);

  // Seat Lock Timer States
  const [lockExpiresAt, setLockExpiresAt] = useState(null);
  const [lockSecondsRemaining, setLockSecondsRemaining] = useState(0);
  const timerIntervalRef = useRef(null);

  // Active Modals & Views
  const [isMovieDetailsOpen, setIsMovieDetailsOpen] = useState(false);
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isTicketPassOpen, setIsTicketPassOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [latestBooking, setLatestBooking] = useState(null);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  // Recalculate price breakdown whenever show, seats, or coupon change
  useEffect(() => {
    if (selectedShow && selectedSeats.length > 0) {
      const calculation = pricingService.calculateBookingPrice({
        showId: selectedShow.id,
        selectedSeats,
        couponCode: appliedCoupon ? appliedCoupon.code : null
      });
      setPricingBreakdown(calculation);
    } else {
      setPricingBreakdown(null);
    }
  }, [selectedShow, selectedSeats, appliedCoupon]);

  // Lock countdown timer worker
  useEffect(() => {
    if (lockExpiresAt) {
      const updateCountdown = () => {
        const remaining = Math.max(0, Math.floor((lockExpiresAt - Date.now()) / 1000));
        setLockSecondsRemaining(remaining);

        if (remaining <= 0) {
          clearInterval(timerIntervalRef.current);
          handleLockTimeout();
        }
      };

      updateCountdown();
      timerIntervalRef.current = setInterval(updateCountdown, 1000);

      return () => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      };
    } else {
      setLockSecondsRemaining(0);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  }, [lockExpiresAt]);

  const handleLockTimeout = useCallback(() => {
    if (selectedShow && selectedSeats.length > 0) {
      const seatNums = selectedSeats.map(s => s.seatNumber);
      seatService.releaseSeats(selectedShow.id, seatNums, currentUser?.id);
    }
    setLockExpiresAt(null);
    setSelectedSeats([]);
    setIsSummaryModalOpen(false);
    setIsPaymentModalOpen(false);
    showWarning('Your seat lock session has expired. Please reselect your preferred seats.');
  }, [selectedShow, selectedSeats, currentUser, showWarning]);

  const openMovieDetails = (movie) => {
    setSelectedMovie(movie);
    setIsMovieDetailsOpen(true);
  };

  const closeMovieDetails = () => {
    setIsMovieDetailsOpen(false);
  };

  const selectShow = (show, movie = null) => {
    if (movie) setSelectedMovie(movie);
    setSelectedShow(show);
    setSelectedSeats([]);
    setAppliedCoupon(null);
    setCouponCode('');
    setLockExpiresAt(null);
    setIsMovieDetailsOpen(false);
    setIsSeatModalOpen(true);
  };

  const toggleSeatSelection = (seat) => {
    if (seat.status === 'BOOKED' || seat.status === 'UNAVAILABLE') {
      return;
    }

    const exists = selectedSeats.some(s => s.seatNumber === seat.seatNumber);
    if (exists) {
      setSelectedSeats(prev => prev.filter(s => s.seatNumber !== seat.seatNumber));
    } else {
      if (selectedSeats.length >= 8) {
        showWarning('You can select a maximum of 8 seats per booking transaction.');
        return;
      }
      setSelectedSeats(prev => [...prev, seat]);
    }
  };

  const proceedToSummary = () => {
    if (!currentUser) {
      openLoginModal('login');
      showInfo('Please log in to reserve and book your seats.');
      return;
    }

    if (selectedSeats.length === 0) {
      showWarning('Please select at least one seat to continue.');
      return;
    }

    try {
      const seatNums = selectedSeats.map(s => s.seatNumber);
      const lockRes = seatService.lockSeats(selectedShow.id, seatNums, currentUser.id, 300);
      setLockExpiresAt(lockRes.expiresAt);
      setIsSeatModalOpen(false);
      setIsSummaryModalOpen(true);
      showInfo('Seats locked for 5 minutes.');
    } catch (err) {
      showError(err.message);
    }
  };

  const applyCouponCode = (code) => {
    if (!pricingBreakdown) return;
    const check = pricingService.validateCoupon(code, pricingBreakdown.subtotal);
    if (check.valid) {
      setAppliedCoupon(check.coupon);
      setCouponCode(check.coupon.code);
      showSuccess(check.message);
    } else {
      showError(check.message);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    showInfo('Coupon removed.');
  };

  const proceedToPayment = () => {
    setIsSummaryModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  const confirmPaymentAndBooking = async (paymentMethod, paymentDetails) => {
    try {
      const confirmedBooking = await bookingService.createBooking({
        user: currentUser,
        showId: selectedShow.id,
        selectedSeats,
        couponCode: appliedCoupon ? appliedCoupon.code : null,
        paymentMethod,
        paymentDetails
      });

      setLatestBooking(confirmedBooking);
      setLockExpiresAt(null);
      setIsPaymentModalOpen(false);
      setIsTicketPassOpen(true);
      showSuccess(`Booking confirmed! Reference: ${confirmedBooking.bookingReference}`);
      return confirmedBooking;
    } catch (err) {
      showError(err.message);
      throw err;
    }
  };

  const cancelCurrentLockAndReturn = () => {
    if (selectedShow && selectedSeats.length > 0) {
      const seatNums = selectedSeats.map(s => s.seatNumber);
      seatService.releaseSeats(selectedShow.id, seatNums, currentUser?.id);
    }
    setLockExpiresAt(null);
    setSelectedSeats([]);
    setIsSummaryModalOpen(false);
    setIsPaymentModalOpen(false);
    setIsSeatModalOpen(true);
  };

  const openHistory = () => {
    setIsHistoryOpen(true);
  };

  const closeHistory = () => {
    setIsHistoryOpen(false);
  };

  const openCancelModal = (booking) => {
    setBookingToCancel(booking);
    setIsCancelModalOpen(true);
  };

  const closeCancelModal = () => {
    setIsCancelModalOpen(false);
    setBookingToCancel(null);
  };

  return (
    <BookingContext.Provider
      value={{
        selectedMovie,
        selectedShow,
        selectedSeats,
        pricingBreakdown,
        couponCode,
        appliedCoupon,
        lockExpiresAt,
        lockSecondsRemaining,
        isMovieDetailsOpen,
        isSeatModalOpen,
        isSummaryModalOpen,
        isPaymentModalOpen,
        isTicketPassOpen,
        isHistoryOpen,
        isCancelModalOpen,
        latestBooking,
        bookingToCancel,
        openMovieDetails,
        closeMovieDetails,
        selectShow,
        toggleSeatSelection,
        proceedToSummary,
        applyCouponCode,
        removeCoupon,
        proceedToPayment,
        confirmPaymentAndBooking,
        cancelCurrentLockAndReturn,
        openHistory,
        closeHistory,
        openCancelModal,
        closeCancelModal,
        setIsTicketPassOpen,
        setIsSeatModalOpen,
        setLatestBooking
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}

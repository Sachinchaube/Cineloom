import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { bookingService, BookingStatus } from '../../services/bookingService';
import { cancellationService } from '../../services/cancellationService';
import { useNotification } from '../../context/NotificationContext';
import {
  X,
  Ticket,
  Calendar,
  Clock,
  MapPin,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Film
} from 'lucide-react';

export function BookingHistoryModal() {
  const { currentUser } = useAuth();
  const {
    isHistoryOpen,
    closeHistory,
    setLatestBooking,
    setIsTicketPassOpen
  } = useBooking();

  const { showSuccess, showError } = useNotification();
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'CONFIRMED' | 'REFUNDED'
  const [bookings, setBookings] = useState([]);
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [cancelEvaluation, setCancelEvaluation] = useState(null);
  const [cancelReason, setCancelReason] = useState('Change of plans');
  const [processingCancel, setProcessingCancel] = useState(false);

  const fetchBookings = () => {
    if (currentUser) {
      const userBookings = bookingService.getUserBookings(currentUser.id);
      setBookings(userBookings);
    }
  };

  useEffect(() => {
    if (isHistoryOpen) {
      fetchBookings();
    }
  }, [isHistoryOpen, currentUser]);

  const filteredBookings = useMemo(() => {
    if (activeFilter === 'ALL') return bookings;
    return bookings.filter(b => b.bookingStatus === activeFilter);
  }, [bookings, activeFilter]);

  const handleOpenCancelDialog = (booking) => {
    const evaluation = cancellationService.evaluateCancellationEligibility(booking.id);
    setCancelEvaluation(evaluation);
    setCancelModalBooking(booking);
  };

  const handleConfirmCancellation = () => {
    if (!cancelModalBooking) return;
    setProcessingCancel(true);

    try {
      const updated = cancellationService.processCancellation(cancelModalBooking.id, cancelReason);
      showSuccess(`Booking ${updated.bookingReference} cancelled. Refund of ₹${updated.cancellation?.refundAmount?.toFixed(2)} initiated.`);
      setCancelModalBooking(null);
      setCancelEvaluation(null);
      fetchBookings();
    } catch (err) {
      showError(err.message);
    } finally {
      setProcessingCancel(false);
    }
  };

  if (!isHistoryOpen) return null;

  return (
    <div className="modal-backdrop" onClick={closeHistory}>
      <div
        className="modal-card"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '760px', maxHeight: '90vh' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Ticket size={20} color="var(--accent-primary)" />
            <h3>My Movie Bookings</h3>
          </div>
          <button className="modal-close-btn" onClick={closeHistory}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          {/* Status Tabs */}
          <div className="status-tabs" style={{ marginBottom: '20px' }}>
            <button
              className={`status-tab-btn ${activeFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setActiveFilter('ALL')}
            >
              All ({bookings.length})
            </button>
            <button
              className={`status-tab-btn ${activeFilter === 'CONFIRMED' ? 'active' : ''}`}
              onClick={() => setActiveFilter('CONFIRMED')}
            >
              Confirmed ({bookings.filter(b => b.bookingStatus === 'CONFIRMED').length})
            </button>
            <button
              className={`status-tab-btn ${activeFilter === 'REFUNDED' ? 'active' : ''}`}
              onClick={() => setActiveFilter('REFUNDED')}
            >
              Cancelled / Refunded ({bookings.filter(b => b.bookingStatus === 'REFUNDED').length})
            </button>
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              background: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)'
            }}>
              <Film size={32} color="var(--text-muted)" style={{ margin: '0 auto 10px' }} />
              <h4 style={{ fontSize: '16px', marginBottom: '4px' }}>No Bookings Found</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                You have no bookings matching the selected criteria.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredBookings.map(b => {
                const isConfirmed = b.bookingStatus === BookingStatus.CONFIRMED;
                const isRefunded = b.bookingStatus === BookingStatus.REFUNDED;

                return (
                  <div
                    key={b.id}
                    style={{
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-md)',
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px', fontWeight: 800 }}>{b.movieTitle}</span>
                          <span className="badge badge-format">{b.format}</span>
                        </div>
                        <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                          Ref: <strong style={{ color: 'var(--accent-primary)' }}>{b.bookingReference}</strong> • Booked on {new Date(b.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div>
                        {isConfirmed && <span className="badge badge-status-confirmed">CONFIRMED</span>}
                        {isRefunded && <span className="badge badge-status-refunded">CANCELLED & REFUNDED</span>}
                      </div>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                      gap: '10px',
                      background: 'rgba(0, 0, 0, 0.2)',
                      padding: '12px',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Date & Time</div>
                        <div style={{ fontSize: '13px', fontWeight: 600 }}>{b.showDate}</div>
                        <div style={{ fontSize: '12px', color: 'var(--accent-gold)' }}>{b.showTime}</div>
                      </div>

                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Theatre & Screen</div>
                        <div style={{ fontSize: '13px', fontWeight: 600 }}>{b.theatreName}</div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{b.screenName}</div>
                      </div>

                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Seats Booked</div>
                        <div style={{ fontSize: '13.5px', fontWeight: 700 }}>
                          {b.seats.map(s => s.seatNumber).join(', ')}
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                          Total Paid: ₹{b.totalAmount.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {isRefunded && b.cancellation && (
                      <div style={{
                        padding: '10px 14px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '12.5px'
                      }}>
                        <span style={{ fontWeight: 700, color: '#f87171' }}>Refund Information:</span>{' '}
                        ₹{b.cancellation.refundAmount?.toFixed(2)} ({b.cancellation.refundPercentage}% of base price) refunded to original payment method.
                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Reason: {b.cancellation.reason} • Ref: {b.cancellation.refundReference}
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setLatestBooking(b);
                          setIsTicketPassOpen(true);
                        }}
                      >
                        <Ticket size={14} /> View Ticket Pass
                      </button>

                      {isConfirmed && (
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                          onClick={() => handleOpenCancelDialog(b)}
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Cancellation Confirmation Dialog */}
          {cancelModalBooking && cancelEvaluation && (
            <div className="modal-backdrop" style={{ zIndex: 1200 }}>
              <div className="modal-card" style={{ maxWidth: '500px' }}>
                <div className="modal-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={18} color="#f59e0b" />
                    <h3>Confirm Ticket Cancellation</h3>
                  </div>
                  <button className="modal-close-btn" onClick={() => setCancelModalBooking(null)}>
                    <X size={16} />
                  </button>
                </div>

                <div className="modal-body">
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                    Are you sure you want to cancel your booking for <strong>{cancelModalBooking.movieTitle}</strong> (Ref: {cancelModalBooking.bookingReference})?
                  </p>

                  <div style={{
                    background: 'var(--bg-tertiary)',
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    marginBottom: '16px',
                    fontSize: '13px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span>Hours until showtime:</span>
                      <strong>{cancelEvaluation.hoursUntilShow} hrs</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span>Applicable Refund Tier:</span>
                      <strong style={{ color: '#10b981' }}>{cancelEvaluation.refundPercentage}%</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span>Refund Amount:</span>
                      <strong style={{ color: '#34d399', fontSize: '15px' }}>₹{cancelEvaluation.refundAmount.toFixed(2)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      <span>Convenience fee retained:</span>
                      <span>₹{cancelEvaluation.convenienceFeeRetained?.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Reason for Cancellation</label>
                    <select
                      className="input-field"
                      value={cancelReason}
                      onChange={e => setCancelReason(e.target.value)}
                    >
                      <option value="Change of plans">Change of plans</option>
                      <option value="Booked wrong showtime/date">Booked wrong showtime/date</option>
                      <option value="Emergency circumstances">Emergency circumstances</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setCancelModalBooking(null)}
                    disabled={processingCancel}
                  >
                    Keep Booking
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleConfirmCancellation}
                    disabled={processingCancel}
                  >
                    {processingCancel ? 'Processing Refund...' : `Confirm Cancellation (₹${cancelEvaluation.refundAmount.toFixed(2)} Refund)`}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={closeHistory}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

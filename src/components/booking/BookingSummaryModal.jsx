import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import {
  X,
  Clock,
  Tag,
  ShieldCheck,
  CreditCard,
  ArrowLeft,
  Check,
  AlertTriangle
} from 'lucide-react';

export function BookingSummaryModal() {
  const {
    selectedShow,
    selectedSeats,
    pricingBreakdown,
    couponCode,
    appliedCoupon,
    lockSecondsRemaining,
    applyCouponCode,
    removeCoupon,
    proceedToPayment,
    cancelCurrentLockAndReturn,
    isSummaryModalOpen
  } = useBooking();

  const [inputCoupon, setInputCoupon] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  if (!isSummaryModalOpen || !selectedShow || !pricingBreakdown) return null;

  const mins = Math.floor(lockSecondsRemaining / 60);
  const secs = lockSecondsRemaining % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div className="modal-backdrop" onClick={cancelCurrentLockAndReturn}>
      <div
        className="modal-card"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '620px', maxHeight: '90vh' }}
      >
        <div className="modal-header">
          <div>
            <h3>Booking Summary</h3>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Step 2 of 3 • Review pricing and apply discounts
            </div>
          </div>
          <button className="modal-close-btn" onClick={cancelCurrentLockAndReturn}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          {/* Seat Lock Countdown Banner */}
          <div className="lock-timer-banner" style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} />
              <span>Seats temporarily held:</span>
            </div>
            <div className="timer-digits">{timeFormatted}</div>
          </div>

          {/* Movie & Show Info Box */}
          <div style={{
            background: 'var(--bg-tertiary)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            border: '1px solid var(--border-light)'
          }}>
            <h4 style={{ fontSize: '16.5px', fontWeight: 800, marginBottom: '4px' }}>
              {selectedShow.movieTitle}
            </h4>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span>{selectedShow.theatreName}</span>
              <span>•</span>
              <span>{selectedShow.screenName}</span>
            </div>
            <div style={{ fontSize: '12.5px', color: 'var(--accent-gold)', fontWeight: 600, marginTop: '4px' }}>
              {selectedShow.date} at {selectedShow.startTime} ({selectedShow.format})
            </div>
          </div>

          {/* Selected Seats */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Selected Seats ({pricingBreakdown.seatCount}):
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {pricingBreakdown.seatsBreakdown.map(s => (
                <div
                  key={s.seatNumber}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-medium)',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '12.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{s.seatNumber}</span>
                  <span style={{ color: 'var(--text-muted)' }}>({s.category})</span>
                  <span style={{ fontWeight: 600 }}>${s.finalPrice.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Promo Offers & Coupons */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Promo Voucher or Offer Code:
            </div>

            {appliedCoupon ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 'var(--radius-md)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Tag size={16} color="#10b981" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#34d399' }}>
                      {appliedCoupon.code} Applied
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      {appliedCoupon.description}
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-outline btn-sm"
                  style={{ color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.4)', fontSize: '11px' }}
                  onClick={removeCoupon}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="coupon-apply-box">
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter code (e.g. CINELOOM20, FIRSTSHOW)"
                  value={inputCoupon}
                  onChange={e => setInputCoupon(e.target.value.toUpperCase())}
                  style={{ textTransform: 'uppercase' }}
                />
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    applyCouponCode(inputCoupon);
                    setInputCoupon('');
                  }}
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div style={{
            background: 'var(--bg-tertiary)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)',
            marginBottom: '16px'
          }}>
            <div className="summary-line-item">
              <span>Tickets Subtotal</span>
              <span>${pricingBreakdown.subtotal.toFixed(2)}</span>
            </div>

            {pricingBreakdown.discountAmount > 0 && (
              <div className="summary-line-item" style={{ color: '#34d399' }}>
                <span>Coupon Discount ({pricingBreakdown.couponApplied?.code})</span>
                <span>-${pricingBreakdown.discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="summary-line-item">
              <span>Convenience & Booking Fee</span>
              <span>${pricingBreakdown.convenienceFee.toFixed(2)}</span>
            </div>

            <div className="summary-line-item">
              <span>Taxes & GST ({pricingBreakdown.taxRate}%)</span>
              <span>${pricingBreakdown.taxAmount.toFixed(2)}</span>
            </div>

            <div className="summary-line-item highlight">
              <span>Grand Total</span>
              <span style={{ color: 'var(--accent-primary)', fontSize: '20px' }}>
                ${pricingBreakdown.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Cancellation Policy Preview */}
          <div style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            lineHeight: 1.5,
            padding: '10px 12px',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-light)'
          }}>
            <strong>Cancellation Notice:</strong> Free cancellation with 80% refund available up to 2 hours before showtime. Convenience fees are non-refundable.
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button className="btn btn-secondary" onClick={cancelCurrentLockAndReturn}>
            <ArrowLeft size={16} /> Reselect Seats
          </button>

          <button className="btn btn-primary btn-lg" onClick={proceedToPayment}>
            <CreditCard size={18} /> Pay ${pricingBreakdown.totalAmount.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}

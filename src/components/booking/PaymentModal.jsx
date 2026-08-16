import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import {
  X,
  CreditCard,
  QrCode,
  Building2,
  Lock,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft
} from 'lucide-react';

export function PaymentModal() {
  const {
    selectedShow,
    pricingBreakdown,
    confirmPaymentAndBooking,
    isPaymentModalOpen,
    cancelCurrentLockAndReturn
  } = useBooking();

  const [paymentMethod, setPaymentMethod] = useState('CARD'); // 'CARD' | 'UPI' | 'NET_BANKING'
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('782');
  const [cardHolder, setCardHolder] = useState('Alex Mercer');
  const [upiId, setUpiId] = useState('customer@okaxis');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [processing, setProcessing] = useState(false);

  if (!isPaymentModalOpen || !selectedShow || !pricingBreakdown) return null;

  const handlePay = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      await confirmPaymentAndBooking(paymentMethod, {
        cardNumber: cardNumber.replace(/\s+/g, ''),
        cardExpiry,
        cardCvv,
        cardHolder,
        upiId,
        bankName: selectedBank,
        simulateFailure
      });
    } catch {
      // Error notification handled in context
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={cancelCurrentLockAndReturn}>
      <div
        className="modal-card"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '580px', maxHeight: '90vh' }}
      >
        <div className="modal-header">
          <div>
            <h3>Secure Checkout</h3>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Step 3 of 3 • 256-Bit SSL Encrypted Mock Gateway
            </div>
          </div>
          <button className="modal-close-btn" onClick={cancelCurrentLockAndReturn}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          {/* Amount Due Banner */}
          <div style={{
            background: 'var(--bg-tertiary)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid var(--border-light)'
          }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Total Payable Amount</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent-primary)', fontFamily: 'var(--font-heading)' }}>
                ₹{pricingBreakdown.totalAmount.toFixed(2)}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '12.5px', fontWeight: 600 }}>
              <ShieldCheck size={18} /> Verified Payment
            </div>
          </div>

          {/* Payment Method Selector Tabs */}
          <div className="status-tabs" style={{ marginBottom: '20px' }}>
            <button
              type="button"
              className={`status-tab-btn ${paymentMethod === 'CARD' ? 'active' : ''}`}
              style={{ flex: 1 }}
              onClick={() => setPaymentMethod('CARD')}
            >
              <CreditCard size={14} style={{ display: 'inline', marginRight: '6px' }} /> Card
            </button>
            <button
              type="button"
              className={`status-tab-btn ${paymentMethod === 'UPI' ? 'active' : ''}`}
              style={{ flex: 1 }}
              onClick={() => setPaymentMethod('UPI')}
            >
              <QrCode size={14} style={{ display: 'inline', marginRight: '6px' }} /> UPI / QR
            </button>
            <button
              type="button"
              className={`status-tab-btn ${paymentMethod === 'NET_BANKING' ? 'active' : ''}`}
              style={{ flex: 1 }}
              onClick={() => setPaymentMethod('NET_BANKING')}
            >
              <Building2 size={14} style={{ display: 'inline', marginRight: '6px' }} /> Net Banking
            </button>
          </div>

          <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {paymentMethod === 'CARD' && (
              <>
                <div className="input-group">
                  <label className="input-label">Cardholder Name</label>
                  <input
                    type="text"
                    className="input-field"
                    value={cardHolder}
                    onChange={e => setCardHolder(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Card Number</label>
                  <input
                    type="text"
                    className="input-field"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="input-group">
                    <label className="input-label">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      className="input-field"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">CVV / Security</label>
                    <input
                      type="password"
                      className="input-field"
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value)}
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {paymentMethod === 'UPI' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="input-group">
                  <label className="input-label">Virtual Payment Address (VPA) / UPI ID</label>
                  <input
                    type="text"
                    className="input-field"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    placeholder="username@okaxis"
                    required
                  />
                </div>

                <div style={{
                  padding: '14px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  border: '1px dashed var(--border-medium)'
                }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    Or scan QR Code with Google Pay, PhonePe, or Paytm:
                  </div>
                  <div className="qr-matrix-sim" style={{ margin: '0 auto', width: '100px', height: '100px' }}>
                    {Array.from({ length: 49 }).map((_, i) => (
                      <div key={i} className={`qr-cell ${i % 3 === 0 || i % 7 === 0 ? '' : 'white'}`} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'NET_BANKING' && (
              <div className="input-group">
                <label className="input-label">Select Bank</label>
                <select
                  className="input-field"
                  value={selectedBank}
                  onChange={e => setSelectedBank(e.target.value)}
                >
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="State Bank of India">State Bank of India (SBI)</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                  <option value="Punjab National Bank">Punjab National Bank</option>
                </select>
              </div>
            )}

            {/* Test Simulation Toggle */}
            <div style={{
              marginTop: '8px',
              padding: '10px 14px',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1px solid var(--border-light)'
            }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Test Mode: Simulate Payment Decline
              </span>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={simulateFailure}
                  onChange={e => setSimulateFailure(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--accent-primary)' }}
                />
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ marginTop: '10px' }}
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 size={18} className="anim-spin" /> Authorizing Payment...
                </>
              ) : (
                <>
                  <Lock size={16} /> Authorize & Pay ₹{pricingBreakdown.totalAmount.toFixed(2)}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

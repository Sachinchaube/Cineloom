import React from 'react';
import { pricingService } from '../../services/pricingService';
import { useNotification } from '../../context/NotificationContext';
import { Tag, Copy, Sparkles, Percent, Gift } from 'lucide-react';

export function OffersView() {
  const coupons = pricingService.getAllCoupons();
  const { showSuccess } = useNotification();

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    showSuccess(`Coupon code "${code}" copied to clipboard!`);
  };

  return (
    <div className="anim-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Gift size={22} color="var(--accent-primary)" /> Exclusive Cinema Offers & Deals
        </h2>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Apply promo vouchers at checkout for instant discounts on premium movie tickets
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
        {coupons.map(c => (
          <div
            key={c.code}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '80px', height: '80px', background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="badge badge-format">
                  {c.discountType === 'PERCENTAGE' ? `${c.value}% OFF` : `₹${c.value} FLAT OFF`}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Valid till {c.expiryDate}
                </span>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>{c.description}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Minimum booking subtotal of ₹{c.minBookingAmount?.toFixed(0)} required. Max discount: ₹{c.maxDiscount?.toFixed(0)}.
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-tertiary)',
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border-strong)'
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '15px', color: '#34d399', letterSpacing: '0.05em' }}>
                {c.code}
              </span>

              <button
                className="btn btn-outline btn-sm"
                onClick={() => handleCopyCode(c.code)}
                style={{ fontSize: '11.5px' }}
              >
                <Copy size={13} /> Copy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

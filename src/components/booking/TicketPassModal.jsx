import React from 'react';
import { useBooking } from '../../context/BookingContext';
import {
  X,
  CheckCircle2,
  Download,
  Printer,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Film,
  Sparkles
} from 'lucide-react';

export function TicketPassModal() {
  const { latestBooking, isTicketPassOpen, setIsTicketPassOpen } = useBooking();

  if (!isTicketPassOpen || !latestBooking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsTicketPassOpen(false)}>
      <div
        className="modal-card"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '520px', maxHeight: '92vh' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={20} color="#10b981" />
            <h3>Booking Confirmed!</h3>
          </div>
          <button className="modal-close-btn" onClick={() => setIsTicketPassOpen(false)}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '24px' }}>
          {/* Digital Boarding Ticket Pass */}
          <div className="ticket-pass-card">
            <div className="ticket-notch-left" />
            <div className="ticket-notch-right" />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Film size={18} color="var(--accent-primary)" />
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '18px' }}>
                  Cine<span>loom</span> Pass
                </span>
              </div>
              <span className="badge badge-status-confirmed">CONFIRMED</span>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Booking Reference
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', letterSpacing: '0.08em' }}>
                {latestBooking.bookingReference}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '18px', fontWeight: 800 }}>{latestBooking.movieTitle}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {latestBooking.format} • {latestBooking.screenName}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'var(--bg-tertiary)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Date & Time</div>
                <div style={{ fontSize: '13px', fontWeight: 700 }}>
                  {latestBooking.showDate}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--accent-gold)' }}>
                  {latestBooking.showTime}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Seats</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>
                  {latestBooking.seats.map(s => s.seatNumber).join(', ')}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                  {latestBooking.seatCount} {latestBooking.seatCount === 1 ? 'Seat' : 'Seats'}
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Theatre Venue</div>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>{latestBooking.theatreName}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{latestBooking.theatreLocation}</div>
            </div>

            {/* QR Code Matrix Simulator */}
            <div className="ticket-qr-section">
              <div className="qr-matrix-sim">
                {Array.from({ length: 49 }).map((_, i) => (
                  <div key={i} className={`qr-cell ${i % 2 === 0 || i % 5 === 0 ? '' : 'white'}`} />
                ))}
              </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: '11.5px', color: 'var(--text-muted)' }}>
              Scan QR code at the automated cinema turnstile for entry
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button className="btn btn-secondary" onClick={handlePrint}>
            <Printer size={15} /> Print Pass
          </button>

          <button className="btn btn-primary" onClick={() => setIsTicketPassOpen(false)}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

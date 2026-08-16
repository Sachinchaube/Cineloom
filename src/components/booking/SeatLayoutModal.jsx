import React, { useMemo } from 'react';
import { useBooking } from '../../context/BookingContext';
import { seatService, SeatStatus } from '../../services/seatService';
import { X, Clock, ShieldCheck, Ticket, AlertCircle } from 'lucide-react';

export function SeatLayoutModal() {
  const {
    selectedShow,
    selectedMovie,
    selectedSeats,
    toggleSeatSelection,
    proceedToSummary,
    isSeatModalOpen,
    setIsSeatModalOpen
  } = useBooking();

  const layoutData = useMemo(() => {
    if (!selectedShow) return null;
    return seatService.generateSeatLayout(selectedShow.id);
  }, [selectedShow, isSeatModalOpen]);

  if (!isSeatModalOpen || !selectedShow || !layoutData) return null;

  const totalApprox = selectedSeats.reduce((acc, s) => acc + (s.basePrice || 14), 0);

  return (
    <div className="modal-backdrop" onClick={() => setIsSeatModalOpen(false)}>
      <div
        className="modal-card"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '820px', maxHeight: '92vh' }}
      >
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '18px' }}>Select Seats</h3>
            <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              {selectedShow.movieTitle} • {selectedShow.theatreName} • {selectedShow.screenName}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--accent-gold)', fontWeight: 600 }}>
              {selectedShow.date} at {selectedShow.startTime} ({selectedShow.format})
            </div>
          </div>
          <button className="modal-close-btn" onClick={() => setIsSeatModalOpen(false)}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Curved Cinema Screen */}
          <div className="screen-indicator-container">
            <div className="curved-cinema-screen" />
            <div className="screen-text">All Eyes This Way • Cinema Screen</div>
          </div>

          {/* Seat Legend */}
          <div className="seat-legend-row" style={{ marginBottom: '20px' }}>
            <div className="legend-item">
              <div className="legend-sample" style={{ background: 'var(--seat-available)', border: '1px solid var(--border-medium)' }} />
              <span>Available</span>
            </div>
            <div className="legend-item">
              <div className="legend-sample" style={{ background: 'var(--seat-selected)', border: '1px solid #ff4d58' }} />
              <span>Selected</span>
            </div>
            <div className="legend-item">
              <div className="legend-sample" style={{ background: '#181a20', border: '1px solid rgba(255,255,255,0.06)' }} />
              <span>Booked</span>
            </div>
            <div className="legend-item">
              <div className="legend-sample" style={{ background: 'var(--seat-locked)' }} />
              <span>Locked</span>
            </div>
          </div>

          {/* Seat Grid Rows */}
          <div className="seat-matrix-wrapper">
            {layoutData.rows.map(rowObj => (
              <div key={rowObj.row} className="seat-row">
                <span className="seat-row-letter">{rowObj.row}</span>

                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {rowObj.seats.map((seat, idx) => {
                    const isSelected = selectedSeats.some(s => s.seatNumber === seat.seatNumber);
                    let btnClass = 'seat-btn-available';

                    if (seat.status === SeatStatus.BOOKED) {
                      btnClass = 'seat-btn-booked';
                    } else if (seat.status === SeatStatus.LOCKED && !isSelected) {
                      btnClass = 'seat-btn-locked';
                    } else if (isSelected) {
                      btnClass = 'seat-btn-selected';
                    }

                    return (
                      <React.Fragment key={seat.seatNumber}>
                        {idx === 5 && <div className="seat-aisle-gap" />}
                        <button
                          className={`seat-button ${btnClass}`}
                          disabled={seat.status === SeatStatus.BOOKED || (seat.status === SeatStatus.LOCKED && !isSelected)}
                          onClick={() => toggleSeatSelection(seat)}
                          title={`${seat.seatNumber} (${seat.categoryName} - $${seat.basePrice})`}
                        >
                          {seat.column}
                        </button>
                      </React.Fragment>
                    );
                  })}
                </div>

                <span style={{ fontSize: '11px', color: 'var(--text-muted)', width: '60px', textAlign: 'right' }}>
                  ${rowObj.basePrice.toFixed(0)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>
              Seats: {selectedSeats.length ? selectedSeats.map(s => s.seatNumber).join(', ') : 'None selected'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Estimated: ${totalApprox.toFixed(2)} + taxes & fees
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={() => setIsSeatModalOpen(false)}>
              Cancel
            </button>

            <button
              className="btn btn-primary"
              disabled={selectedSeats.length === 0}
              onClick={proceedToSummary}
            >
              <Ticket size={16} /> Proceed ({selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { showService } from '../../services/showService';
import { theatreService } from '../../services/theatreService';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { Calendar, MapPin, Sparkles, ArrowLeft, Clock } from 'lucide-react';

export function TheatreShowSelector({ movie, onBack }) {
  const { selectedCity } = useAuth();
  const { selectShow } = useBooking();

  // Generate 5 days starting from today
  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 5; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const isoStr = d.toISOString().split('T')[0];
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNumber = d.getDate();
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
      dates.push({ isoStr, dayName, dayNumber, monthName });
    }
    return dates;
  }, []);

  const [selectedDate, setSelectedDate] = useState(availableDates[0].isoStr);

  // Filter shows for this movie, date, and city
  const showsByTheatre = useMemo(() => {
    const shows = showService.getShows({
      movieId: movie.id,
      date: selectedDate,
      city: selectedCity
    });

    const theatres = theatreService.getTheatresByCity(selectedCity);
    const result = [];

    theatres.forEach(theatre => {
      const theatreShows = shows.filter(s => s.theatreId === theatre.id);
      if (theatreShows.length > 0) {
        result.push({
          theatre,
          shows: theatreShows
        });
      }
    });

    return result;
  }, [movie.id, selectedDate, selectedCity]);

  return (
    <div className="schedule-section anim-slide-up">
      {/* Header with Movie Info and Back Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button className="btn btn-secondary btn-sm" onClick={onBack}>
            <ArrowLeft size={16} /> All Movies
          </button>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 800 }}>{movie.title}</h2>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', gap: '8px' }}>
              <span>{movie.genre}</span>
              <span>•</span>
              <span>{movie.language}</span>
              <span>•</span>
              <span>{movie.duration}</span>
              <span>•</span>
              <span className="badge badge-cert" style={{ fontSize: '10px' }}>{movie.certification}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          <MapPin size={15} color="var(--accent-primary)" /> {selectedCity}
        </div>
      </div>

      {/* Date Ribbon */}
      <div>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
          Select Date:
        </div>
        <div className="date-strip">
          {availableDates.map(d => (
            <button
              key={d.isoStr}
              className={`date-card-btn ${selectedDate === d.isoStr ? 'active' : ''}`}
              onClick={() => setSelectedDate(d.isoStr)}
            >
              <span className="date-day-name">{d.dayName}</span>
              <span className="date-day-num">{d.dayNumber}</span>
              <span style={{ fontSize: '10px', opacity: 0.7 }}>{d.monthName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Theatres and Showtimes List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {showsByTheatre.length === 0 ? (
          <div style={{
            background: 'var(--bg-secondary)',
            padding: '40px 20px',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
            border: '1px solid var(--border-light)'
          }}>
            <Calendar size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '18px', marginBottom: '6px' }}>No Shows Available</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '420px', margin: '0 auto' }}>
              There are no scheduled screenings for {movie.title} in {selectedCity} on this selected date. Please choose another date or city.
            </p>
          </div>
        ) : (
          showsByTheatre.map(({ theatre, shows }) => (
            <div key={theatre.id} className="theatre-card">
              <div className="theatre-info-header">
                <div>
                  <div className="theatre-name">{theatre.name}</div>
                  <div className="theatre-location">{theatre.location}</div>
                </div>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {theatre.facilities && theatre.facilities.map(fac => (
                    <span key={fac} className="badge badge-cert" style={{ fontSize: '10.5px' }}>
                      {fac}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Available Showtimes:
                </div>
                <div className="showtimes-grid">
                  {shows.map(show => {
                    const bookedCount = (show.bookedSeats || []).length;
                    const isAlmostFull = bookedCount > 40;

                    return (
                      <div
                        key={show.id}
                        className="showtime-pill"
                        onClick={() => selectShow(show, movie)}
                      >
                        <div className="showtime-time">{show.startTime}</div>
                        <div className="showtime-format">{show.format}</div>
                        <div className="showtime-price">
                          From ₹{show.basePrice.toFixed(0)}
                        </div>
                        {isAlmostFull && (
                          <div style={{ fontSize: '9.5px', color: '#f87171', fontWeight: 700, marginTop: '2px' }}>
                            Fast Filling
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

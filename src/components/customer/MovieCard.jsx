import React from 'react';
import { useBooking } from '../../context/BookingContext';
import { Star, Clock, Ticket, Info } from 'lucide-react';

export function MovieCard({ movie, onBookNow }) {
  const { openMovieDetails } = useBooking();

  return (
    <div className="movie-card anim-slide-up">
      <div
        className="movie-poster-wrap"
        onClick={() => openMovieDetails(movie)}
      >
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="movie-poster-img"
          loading="lazy"
        />

        <div className="movie-rating-chip">
          <Star size={12} fill="#f6c050" color="#f6c050" />
          <span>{movie.rating}</span>
        </div>

        <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '4px' }}>
          <span className="badge badge-cert">{movie.certification}</span>
        </div>
      </div>

      <div className="movie-card-info">
        <div
          className="movie-card-title"
          title={movie.title}
          onClick={() => openMovieDetails(movie)}
        >
          {movie.title}
        </div>

        <div className="movie-card-meta">
          <span>{movie.genre}</span>
          <span>•</span>
          <span>{movie.language}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-muted)' }}>
          <Clock size={12} /> {movie.duration}
        </div>

        <div className="movie-formats-row">
          {movie.formats.map(fmt => (
            <span key={fmt} className="badge badge-format" style={{ fontSize: '10px', padding: '2px 6px' }}>
              {fmt}
            </span>
          ))}
        </div>

        {movie.status === 'NOW_SHOWING' ? (
          <button
            className="btn btn-primary btn-sm movie-card-btn"
            onClick={() => onBookNow(movie)}
          >
            <Ticket size={14} /> Book Tickets
          </button>
        ) : (
          <button
            className="btn btn-secondary btn-sm movie-card-btn"
            onClick={() => openMovieDetails(movie)}
          >
            <Info size={14} /> View Details
          </button>
        )}
      </div>
    </div>
  );
}

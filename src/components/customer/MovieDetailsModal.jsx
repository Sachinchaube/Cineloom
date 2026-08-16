import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import {
  X,
  Star,
  Clock,
  Calendar,
  Ticket,
  Play,
  Film,
  UserCheck,
  Award
} from 'lucide-react';

export function MovieDetailsModal({ onSelectForBooking }) {
  const { selectedMovie, isMovieDetailsOpen, closeMovieDetails } = useBooking();
  const [showTrailer, setShowTrailer] = useState(false);

  if (!isMovieDetailsOpen || !selectedMovie) return null;

  return (
    <div className="modal-backdrop" onClick={closeMovieDetails}>
      <div
        className="modal-card"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '780px', maxHeight: '88vh' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Film size={18} color="var(--accent-primary)" />
            <h3>Movie Details</h3>
          </div>
          <button className="modal-close-btn" onClick={closeMovieDetails}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '20px' }}>
          {/* Header Banner */}
          <div className="movie-details-hero">
            <img
              src={selectedMovie.bannerUrl}
              alt={selectedMovie.title}
              className="movie-details-hero-img"
            />
            <div className="movie-details-hero-overlay" />

            <div className="movie-details-content">
              <img
                src={selectedMovie.posterUrl}
                alt={selectedMovie.title}
                className="movie-details-poster"
              />

              <div className="movie-details-meta-col">
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span className="badge badge-rating">
                    <Star size={12} fill="#f6c050" color="#f6c050" /> {selectedMovie.rating} ({selectedMovie.votes} votes)
                  </span>
                  <span className="badge badge-cert">{selectedMovie.certification}</span>
                </div>

                <h2 style={{ fontSize: '24px', fontWeight: 800 }}>
                  {selectedMovie.title}
                </h2>

                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span>{selectedMovie.genre}</span>
                  <span>•</span>
                  <span>{selectedMovie.language}</span>
                  <span>•</span>
                  <span>{selectedMovie.duration}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Synopsis */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>
              Synopsis
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.65 }}>
              {selectedMovie.description}
            </p>
          </div>

          {/* Cast & Director */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Director
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {selectedMovie.director}
              </div>
            </div>

            <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Release Date
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {selectedMovie.releaseDate}
              </div>
            </div>
          </div>

          {/* Starring Cast */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>Starring Cast</h4>
            <div className="cast-chips">
              {selectedMovie.cast && selectedMovie.cast.map(actor => (
                <div key={actor} className="cast-chip">
                  <UserCheck size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  {actor}
                </div>
              ))}
            </div>
          </div>

          {/* Available Formats */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>Available Screening Formats</h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {selectedMovie.formats.map(fmt => (
                <span key={fmt} className="badge badge-format" style={{ padding: '6px 12px', fontSize: '12px' }}>
                  {fmt}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={closeMovieDetails}>
            Close
          </button>
          
          {selectedMovie.status === 'NOW_SHOWING' && (
            <button
              className="btn btn-primary"
              onClick={() => {
                closeMovieDetails();
                onSelectForBooking(selectedMovie);
              }}
            >
              <Ticket size={16} /> Select Showtimes
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { useBooking } from '../../context/BookingContext';
import { Play, Ticket, Star, Clock, Calendar } from 'lucide-react';

export function HeroBanner({ featuredMovie, onSelectMovie }) {
  const { openMovieDetails } = useBooking();

  if (!featuredMovie) return null;

  return (
    <div className="hero-showcase anim-fade-in">
      <img
        src={featuredMovie.bannerUrl}
        alt={featuredMovie.title}
        className="hero-backdrop-img"
      />
      <div className="hero-gradient-overlay" />

      <div className="hero-content">
        <div className="hero-badges">
          <span className="badge badge-rating">
            <Star size={12} fill="#f6c050" color="#f6c050" /> {featuredMovie.rating} ({featuredMovie.votes} votes)
          </span>
          <span className="badge badge-cert">{featuredMovie.certification}</span>
          <span className="badge badge-format">{featuredMovie.formats.join(' / ')}</span>
        </div>

        <h1 className="hero-title">{featuredMovie.title}</h1>

        <div className="hero-meta">
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Clock size={14} /> {featuredMovie.duration}
          </span>
          <span>•</span>
          <span>{featuredMovie.genre}</span>
          <span>•</span>
          <span>{featuredMovie.language}</span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Calendar size={14} /> Released {featuredMovie.releaseDate}
          </span>
        </div>

        <p className="hero-description">{featuredMovie.description}</p>

        <div className="hero-actions">
          <button
            className="btn btn-primary btn-lg"
            onClick={() => onSelectMovie(featuredMovie)}
          >
            <Ticket size={18} /> Book Tickets Now
          </button>

          <button
            className="btn btn-secondary btn-lg"
            onClick={() => openMovieDetails(featuredMovie)}
          >
            <Play size={16} /> View Details & Trailer
          </button>
        </div>
      </div>
    </div>
  );
}

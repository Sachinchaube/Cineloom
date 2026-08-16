import React from 'react';
import { INITIAL_GENRES, INITIAL_LANGUAGES, INITIAL_FORMATS } from '../../data/seedData';
import { Sparkles, Clapperboard, Filter } from 'lucide-react';

export function MovieFilters({
  statusFilter,
  setStatusFilter,
  selectedGenre,
  setSelectedGenre,
  selectedLanguage,
  setSelectedLanguage,
  selectedFormat,
  setSelectedFormat,
  totalResults
}) {
  return (
    <div className="filter-section">
      <div className="filter-header">
        {/* Status Switcher: Now Showing vs Upcoming */}
        <div className="status-tabs">
          <button
            className={`status-tab-btn ${statusFilter === 'NOW_SHOWING' ? 'active' : ''}`}
            onClick={() => setStatusFilter('NOW_SHOWING')}
          >
            Now Showing
          </button>
          <button
            className={`status-tab-btn ${statusFilter === 'UPCOMING' ? 'active' : ''}`}
            onClick={() => setStatusFilter('UPCOMING')}
          >
            Coming Soon
          </button>
          <button
            className={`status-tab-btn ${statusFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setStatusFilter('ALL')}
          >
            All Movies
          </button>
        </div>

        {/* Dropdown Filters for Language & Format */}
        <div className="filter-dropdown-group">
          <select
            className="filter-select"
            value={selectedLanguage}
            onChange={e => setSelectedLanguage(e.target.value)}
          >
            {INITIAL_LANGUAGES.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>

          <select
            className="filter-select"
            value={selectedFormat}
            onChange={e => setSelectedFormat(e.target.value)}
          >
            {INITIAL_FORMATS.map(fmt => (
              <option key={fmt} value={fmt}>{fmt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Genre Pills */}
      <div className="filter-pills-row">
        {INITIAL_GENRES.map(genre => (
          <button
            key={genre}
            className={`filter-pill ${selectedGenre === genre ? 'active' : ''}`}
            onClick={() => setSelectedGenre(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
}

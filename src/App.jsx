import React, { useState, useMemo } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { BookingProvider, useBooking } from './context/BookingContext';
import { movieService } from './services/movieService';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { AuthModal } from './components/common/AuthModal';
import { GunnuFloatingButton } from './components/common/GunnuFloatingButton';

// Customer Components
import { HeroBanner } from './components/customer/HeroBanner';
import { MovieFilters } from './components/customer/MovieFilters';
import { MovieCard } from './components/customer/MovieCard';
import { MovieDetailsModal } from './components/customer/MovieDetailsModal';
import { TheatreShowSelector } from './components/customer/TheatreShowSelector';
import { OffersView } from './components/customer/OffersView';

// Booking Modals
import { SeatLayoutModal } from './components/booking/SeatLayoutModal';
import { BookingSummaryModal } from './components/booking/BookingSummaryModal';
import { PaymentModal } from './components/booking/PaymentModal';
import { TicketPassModal } from './components/booking/TicketPassModal';
import { BookingHistoryModal } from './components/booking/BookingHistoryModal';

// Admin & Test Portals
import { AdminPortal } from './components/admin/AdminPortal';
import { UnitTestRunner } from './components/tests/UnitTestRunner';

import { Film, Clapperboard, Sparkles } from 'lucide-react';

function MainApp() {
  const [activeView, setActiveView] = useState('movies'); // 'movies' | 'offers' | 'admin' | 'unit-tests'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('NOW_SHOWING');
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const [selectedFormat, setSelectedFormat] = useState('All Formats');

  // Currently focused movie for showtime booking
  const [bookingMovie, setBookingMovie] = useState(null);

  const { currentUser, isAdmin } = useAuth();
  const { openMovieDetails } = useBooking();

  // Filtered movies
  const movies = useMemo(() => {
    return movieService.getMovies({
      searchQuery,
      status: statusFilter,
      genre: selectedGenre,
      language: selectedLanguage,
      format: selectedFormat
    });
  }, [searchQuery, statusFilter, selectedGenre, selectedLanguage, selectedFormat]);

  const featuredMovie = useMemo(() => {
    const all = movieService.getAllMovies();
    return all.find(m => m.featured) || all[0];
  }, []);

  const handleStartBookingForMovie = (movie) => {
    setBookingMovie(movie);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCatalog = () => {
    setBookingMovie(null);
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={(view) => {
          setActiveView(view);
          if (view === 'movies') setBookingMovie(null);
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main View Container */}
      <main className="main-content">
        {activeView === 'movies' && (
          <>
            {bookingMovie ? (
              <TheatreShowSelector
                movie={bookingMovie}
                onBack={handleBackToCatalog}
              />
            ) : (
              <>
                {/* Hero Feature Banner (Only when not searching) */}
                {!searchQuery && selectedGenre === 'All Genres' && (
                  <HeroBanner
                    featuredMovie={featuredMovie}
                    onSelectMovie={handleStartBookingForMovie}
                  />
                )}

                {/* Filter Toolbar */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clapperboard size={20} color="var(--accent-primary)" />
                      {statusFilter === 'NOW_SHOWING' ? 'Now Playing in Theatres' : statusFilter === 'UPCOMING' ? 'Upcoming Releases' : 'All Movies'}
                    </h2>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      Showing {movies.length} {movies.length === 1 ? 'Title' : 'Titles'}
                    </span>
                  </div>

                  <MovieFilters
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    selectedGenre={selectedGenre}
                    setSelectedGenre={setSelectedGenre}
                    selectedLanguage={selectedLanguage}
                    setSelectedLanguage={setSelectedLanguage}
                    selectedFormat={selectedFormat}
                    setSelectedFormat={setSelectedFormat}
                    totalResults={movies.length}
                  />
                </div>

                {/* Movie Cards Catalog Grid */}
                {movies.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-light)'
                  }}>
                    <Film size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
                    <h3 style={{ fontSize: '18px', marginBottom: '6px' }}>No Movies Found</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>
                      We could not find any movies matching your current filter selections. Try adjusting the genre, language, or search query.
                    </p>
                  </div>
                ) : (
                  <div className="movies-grid">
                    {movies.map(movie => (
                      <MovieCard
                        key={movie.id}
                        movie={movie}
                        onBookNow={handleStartBookingForMovie}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {activeView === 'offers' && <OffersView />}

        {activeView === 'admin' && <AdminPortal />}

        {activeView === 'unit-tests' && <UnitTestRunner />}
      </main>

      {/* Global Modals */}
      <MovieDetailsModal onSelectForBooking={handleStartBookingForMovie} />
      <SeatLayoutModal />
      <BookingSummaryModal />
      <PaymentModal />
      <TicketPassModal />
      <BookingHistoryModal />
      <AuthModal />
      <ToastContainer />
      <GunnuFloatingButton />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <BookingProvider>
            <MainApp />
          </BookingProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

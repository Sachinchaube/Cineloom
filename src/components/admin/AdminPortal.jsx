import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { movieService } from '../../services/movieService';
import { theatreService } from '../../services/theatreService';
import { showService } from '../../services/showService';
import { pricingService } from '../../services/pricingService';
import { bookingService } from '../../services/bookingService';
import { loggerService } from '../../services/loggerService';
import { cancellationService } from '../../services/cancellationService';
import { useNotification } from '../../context/NotificationContext';
import {
  LayoutDashboard,
  Film,
  Calendar,
  Building2,
  DollarSign,
  Ticket,
  FileText,
  Plus,
  Trash2,
  Edit,
  AlertTriangle,
  CheckCircle,
  Search,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Tag
} from 'lucide-react';

export function AdminPortal() {
  const { isAdmin, openLoginModal } = useAuth();
  const { showSuccess, showError, showWarning } = useNotification();

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'movies' | 'shows' | 'theatres' | 'pricing' | 'bookings' | 'logs'
  const [refreshKey, setRefreshKey] = useState(0);

  const forceRefresh = () => setRefreshKey(prev => prev + 1);

  // Data fetching
  const movies = useMemo(() => movieService.getAllMovies(), [refreshKey]);
  const theatres = useMemo(() => theatreService.getAllTheatres(), [refreshKey]);
  const shows = useMemo(() => showService.getAllShows(), [refreshKey]);
  const bookings = useMemo(() => bookingService.getAllBookings(), [refreshKey]);
  const pricingConfig = useMemo(() => pricingService.getPricingConfig(), [refreshKey]);
  const coupons = useMemo(() => pricingService.getAllCoupons(), [refreshKey]);
  const logs = useMemo(() => loggerService.getLogs(), [refreshKey]);

  // Dashboard Stats Calculations
  const stats = useMemo(() => {
    const confirmedBookings = bookings.filter(b => b.bookingStatus === 'CONFIRMED');
    const refundedBookings = bookings.filter(b => b.bookingStatus === 'REFUNDED');
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    return {
      totalMovies: movies.length,
      activeMovies: movies.filter(m => m.status === 'NOW_SHOWING').length,
      totalTheatres: theatres.length,
      totalShows: shows.length,
      totalBookings: bookings.length,
      confirmedCount: confirmedBookings.length,
      refundedCount: refundedBookings.length,
      totalRevenue: totalRevenue
    };
  }, [movies, theatres, shows, bookings]);

  // Add Movie Form State
  const [showAddMovieModal, setShowAddMovieModal] = useState(false);
  const [movieForm, setMovieForm] = useState({
    title: '',
    genre: 'Action',
    language: 'English',
    formats: ['2D', '3D'],
    durationMinutes: 135,
    certification: 'UA16+',
    rating: 8.8,
    releaseDate: '2026-08-16',
    status: 'NOW_SHOWING',
    director: '',
    cast: '',
    description: '',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80'
  });

  // Schedule Show Form State
  const [showForm, setShowForm] = useState({
    movieId: movies[0]?.id || '',
    theatreId: theatres[0]?.id || '',
    screenId: theatres[0]?.screens[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    startTime: '07:30 PM',
    basePrice: 250.0
  });
  const [scheduleConflictWarning, setScheduleConflictWarning] = useState(null);

  // New Coupon Form State
  const [couponForm, setCouponForm] = useState({
    code: '',
    description: '',
    discountType: 'PERCENTAGE',
    value: 15,
    maxDiscount: 150,
    minBookingAmount: 400,
    expiryDate: '2026-12-31'
  });

  // Bookings Filter
  const [bookingSearch, setBookingSearch] = useState('');

  // Conflict validator for show scheduler
  const handleShowFormChange = (field, value) => {
    const updated = { ...showForm, [field]: value };
    setShowForm(updated);

    if (field === 'theatreId') {
      const th = theatres.find(t => t.id === value);
      if (th && th.screens.length > 0) {
        updated.screenId = th.screens[0].id;
      }
    }

    // Check conflict
    const selectedMovie = movies.find(m => m.id === updated.movieId);
    const duration = selectedMovie?.durationMinutes || 130;
    const check = showService.checkScheduleConflict(
      updated.screenId,
      updated.date,
      updated.startTime,
      duration
    );

    if (check.conflict) {
      setScheduleConflictWarning(check.reason);
    } else {
      setScheduleConflictWarning(null);
    }
  };

  const handleCreateMovie = (e) => {
    e.preventDefault();
    try {
      movieService.addMovie(movieForm);
      showSuccess(`Movie "${movieForm.title}" added to catalog.`);
      setShowAddMovieModal(false);
      forceRefresh();
    } catch (err) {
      showError(err.message);
    }
  };

  const handleCreateShow = (e) => {
    e.preventDefault();
    try {
      showService.createShow(showForm);
      showSuccess('Screening scheduled successfully!');
      setScheduleConflictWarning(null);
      forceRefresh();
    } catch (err) {
      showError(err.message);
    }
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    try {
      pricingService.addCoupon(couponForm);
      showSuccess(`Offer voucher "${couponForm.code}" created.`);
      setCouponForm({
        code: '',
        description: '',
        discountType: 'PERCENTAGE',
        value: 15,
        maxDiscount: 10,
        minBookingAmount: 25,
        expiryDate: '2026-12-31'
      });
      forceRefresh();
    } catch (err) {
      showError(err.message);
    }
  };

  const handleDeleteMovie = (id, title) => {
    if (window.confirm(`Delete movie "${title}"?`)) {
      try {
        movieService.deleteMovie(id);
        showSuccess(`Movie deleted.`);
        forceRefresh();
      } catch (err) {
        showError(err.message);
      }
    }
  };

  const handleDeleteShow = (id) => {
    try {
      showService.deleteShow(id);
      showSuccess('Show removed from schedule.');
      forceRefresh();
    } catch (err) {
      showError(err.message);
    }
  };

  const handleAdminCancelBooking = (bookingId) => {
    if (window.confirm('Process administrative refund and cancellation for this booking?')) {
      try {
        cancellationService.processCancellation(bookingId, 'Admin Override Cancellation');
        showSuccess('Booking cancelled and refund processed.');
        forceRefresh();
      } catch (err) {
        showError(err.message);
      }
    }
  };

  return (
    <div className="admin-layout anim-fade-in">
      {/* Sidebar Navigation */}
      <div className="admin-sidebar">
        <div style={{ padding: '8px 12px', fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Management Suite
        </div>

        <div
          className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={16} /> Overview KPI
        </div>

        <div
          className={`admin-nav-item ${activeTab === 'movies' ? 'active' : ''}`}
          onClick={() => setActiveTab('movies')}
        >
          <Film size={16} /> Movie Catalog ({movies.length})
        </div>

        <div
          className={`admin-nav-item ${activeTab === 'shows' ? 'active' : ''}`}
          onClick={() => setActiveTab('shows')}
        >
          <Calendar size={16} /> Show Scheduler
        </div>

        <div
          className={`admin-nav-item ${activeTab === 'pricing' ? 'active' : ''}`}
          onClick={() => setActiveTab('pricing')}
        >
          <DollarSign size={16} /> Pricing & Coupons
        </div>

        <div
          className={`admin-nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          <Ticket size={16} /> Bookings ({bookings.length})
        </div>

        <div
          className={`admin-nav-item ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          <FileText size={16} /> Audit Logs ({logs.length})
        </div>
      </div>

      {/* Content Workspace Area */}
      <div className="admin-content-area">
        {/* KPI Dashboard */}
        {activeTab === 'dashboard' && (
          <>
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-title">Gross Revenue</div>
                <div className="kpi-value">₹{stats.totalRevenue.toFixed(2)}</div>
                <div className="kpi-subtext">Confirmed ticket sales</div>
              </div>

              <div className="kpi-card">
                <div className="kpi-title">Total Bookings</div>
                <div className="kpi-value">{stats.totalBookings}</div>
                <div className="kpi-subtext">{stats.confirmedCount} Active, {stats.refundedCount} Refunded</div>
              </div>

              <div className="kpi-card">
                <div className="kpi-title">Active Movies</div>
                <div className="kpi-value">{stats.activeMovies} / {stats.totalMovies}</div>
                <div className="kpi-subtext">Running in theatres</div>
              </div>

              <div className="kpi-card">
                <div className="kpi-title">Scheduled Shows</div>
                <div className="kpi-value">{stats.totalShows}</div>
                <div className="kpi-subtext">Across {stats.totalTheatres} multiplexes</div>
              </div>
            </div>

            {/* Quick Actions & Recent Bookings */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h3 style={{ fontSize: '16.5px' }}>Recent Customer Bookings</h3>
                <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('bookings')}>
                  View All ({bookings.length})
                </button>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Ref Number</th>
                      <th>Customer</th>
                      <th>Movie & Screen</th>
                      <th>Seats</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 5).map(b => (
                      <tr key={b.id}>
                        <td>
                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-primary)' }}>
                            {b.bookingReference}
                          </span>
                        </td>
                        <td>
                          <div>{b.userName}</div>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{b.userEmail}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{b.movieTitle}</div>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{b.theatreName} • {b.screenName}</div>
                        </td>
                        <td>{b.seats.map(s => s.seatNumber).join(', ')}</td>
                        <td style={{ fontWeight: 700 }}>₹{b.totalAmount.toFixed(2)}</td>
                        <td>
                          {b.bookingStatus === 'CONFIRMED' ? (
                            <span className="badge badge-status-confirmed">CONFIRMED</span>
                          ) : (
                            <span className="badge badge-status-refunded">REFUNDED</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Movies Manager */}
        {activeTab === 'movies' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3 style={{ fontSize: '18px' }}>Movie Catalog Manager</h3>
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  Manage titles, posters, durations, and screening status
                </div>
              </div>

              <button className="btn btn-primary btn-sm" onClick={() => setShowAddMovieModal(true)}>
                <Plus size={15} /> Add New Movie
              </button>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Poster</th>
                    <th>Movie Title</th>
                    <th>Genre / Lang</th>
                    <th>Duration</th>
                    <th>Certification</th>
                    <th>Status</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {movies.map(m => (
                    <tr key={m.id}>
                      <td>
                        <img
                          src={m.posterUrl}
                          alt={m.title}
                          style={{ width: '38px', height: '54px', borderRadius: '4px', objectFit: 'cover' }}
                        />
                      </td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{m.title}</div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Dir: {m.director}</div>
                      </td>
                      <td>
                        <div>{m.genre}</div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{m.language}</div>
                      </td>
                      <td>{m.duration}</td>
                      <td>
                        <span className="badge badge-cert">{m.certification}</span>
                      </td>
                      <td>
                        <span
                          className={`badge ${m.status === 'NOW_SHOWING' ? 'badge-status-confirmed' : 'badge-rating'}`}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>★ {m.rating}</td>
                      <td>
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ color: '#f87171', padding: '4px 8px' }}
                          onClick={() => handleDeleteMovie(m.id, m.title)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Show Scheduler */}
        {activeTab === 'shows' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3 style={{ fontSize: '18px' }}>Show Scheduling & Screen Conflict Engine</h3>
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  Assign movies, theatres, screens, and time slots with automated collision detection
                </div>
              </div>
            </div>

            {/* Schedule Form */}
            <form onSubmit={handleCreateShow} style={{
              background: 'var(--bg-tertiary)',
              padding: '20px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                <div className="input-group">
                  <label className="input-label">Select Movie</label>
                  <select
                    className="input-field"
                    value={showForm.movieId}
                    onChange={e => handleShowFormChange('movieId', e.target.value)}
                  >
                    {movies.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.title} ({m.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Select Theatre</label>
                  <select
                    className="input-field"
                    value={showForm.theatreId}
                    onChange={e => handleShowFormChange('theatreId', e.target.value)}
                  >
                    {theatres.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Select Screen</label>
                  <select
                    className="input-field"
                    value={showForm.screenId}
                    onChange={e => handleShowFormChange('screenId', e.target.value)}
                  >
                    {theatres.find(t => t.id === showForm.theatreId)?.screens.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.format})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={showForm.date}
                    onChange={e => handleShowFormChange('date', e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Start Time</label>
                  <input
                    type="text"
                    className="input-field"
                    value={showForm.startTime}
                    placeholder="e.g. 07:30 PM"
                    onChange={e => handleShowFormChange('startTime', e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Base Ticket Price (₹)</label>
                  <input
                    type="number"
                    step="10"
                    className="input-field"
                    value={showForm.basePrice}
                    onChange={e => handleShowFormChange('basePrice', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Conflict Warning Banner */}
              {scheduleConflictWarning && (
                <div className="conflict-warning-banner">
                  <AlertTriangle size={18} color="#ef4444" />
                  <span>{scheduleConflictWarning}</span>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                style={{ alignSelf: 'flex-start' }}
                disabled={Boolean(scheduleConflictWarning)}
              >
                <Plus size={16} /> Schedule Show
              </button>
            </form>

            {/* Existing Shows Table */}
            <div style={{ marginTop: '10px' }}>
              <h4 style={{ fontSize: '15px', marginBottom: '10px' }}>Current Scheduled Shows ({shows.length})</h4>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time Slot</th>
                      <th>Movie</th>
                      <th>Theatre & Screen</th>
                      <th>Format</th>
                      <th>Booked Seats</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shows.slice(0, 15).map(s => (
                      <tr key={s.id}>
                        <td>{s.date}</td>
                        <td style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>
                          {s.startTime} - {s.endTime}
                        </td>
                        <td style={{ fontWeight: 600 }}>{s.movieTitle}</td>
                        <td>
                          <div>{s.theatreName}</div>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{s.screenName}</div>
                        </td>
                        <td>
                          <span className="badge badge-format">{s.format}</span>
                        </td>
                        <td>
                          {(s.bookedSeats || []).length} Seats
                        </td>
                        <td>
                          <button
                            className="btn btn-outline btn-sm"
                            style={{ color: '#f87171', padding: '4px 8px' }}
                            onClick={() => handleDeleteShow(s.id)}
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Pricing & Offers Manager */}
        {activeTab === 'pricing' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3 style={{ fontSize: '18px' }}>Dynamic Pricing & Promo Vouchers</h3>
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  Configure platform surcharges, taxes, fees, and promotional discount codes
                </div>
              </div>
            </div>

            {/* Pricing Parameters Card */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '14px',
              background: 'var(--bg-tertiary)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)'
            }}>
              <div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Convenience Fee</div>
                <div style={{ fontSize: '18px', fontWeight: 800 }}>₹{pricingConfig.convenienceFeePerTicket?.toFixed(2)} / ticket</div>
              </div>

              <div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tax Rate (GST/VAT)</div>
                <div style={{ fontSize: '18px', fontWeight: 800 }}>{pricingConfig.taxRatePercent}%</div>
              </div>

              <div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Weekend Surcharge</div>
                <div style={{ fontSize: '18px', fontWeight: 800 }}>{((pricingConfig.weekendSurchargeMultiplier - 1) * 100).toFixed(0)}%</div>
              </div>

              <div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Max Seats / Booking</div>
                <div style={{ fontSize: '18px', fontWeight: 800 }}>{pricingConfig.maxSeatsPerBooking} Seats</div>
              </div>
            </div>

            {/* Create Coupon Voucher */}
            <form onSubmit={handleCreateCoupon} style={{
              background: 'var(--bg-tertiary)',
              padding: '20px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              <h4 style={{ fontSize: '15px' }}>Create Promotional Offer Coupon</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                <div className="input-group">
                  <label className="input-label">Coupon Code</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. SUMMER25"
                    value={couponForm.code}
                    onChange={e => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Discount Type</label>
                  <select
                    className="input-field"
                    value={couponForm.discountType}
                    onChange={e => setCouponForm({ ...couponForm, discountType: e.target.value })}
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT">Flat Amount (₹)</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Value (% or ₹)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={couponForm.value}
                    onChange={e => setCouponForm({ ...couponForm, value: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Max Discount (₹)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={couponForm.maxDiscount}
                    onChange={e => setCouponForm({ ...couponForm, maxDiscount: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Min Subtotal (₹)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={couponForm.minBookingAmount}
                    onChange={e => setCouponForm({ ...couponForm, minBookingAmount: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Description</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. 20% discount on IMAX screenings"
                  value={couponForm.description}
                  onChange={e => setCouponForm({ ...couponForm, description: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                <Tag size={15} /> Save Promo Code
              </button>
            </form>

            {/* Coupons Table */}
            <div>
              <h4 style={{ fontSize: '15px', marginBottom: '10px' }}>Active Promotional Codes ({coupons.length})</h4>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Description</th>
                      <th>Discount</th>
                      <th>Max Cap</th>
                      <th>Min Subtotal</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map(c => (
                      <tr key={c.code}>
                        <td>
                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#34d399' }}>
                            {c.code}
                          </span>
                        </td>
                        <td>{c.description}</td>
                        <td style={{ fontWeight: 700 }}>
                          {c.discountType === 'PERCENTAGE' ? `${c.value}%` : `₹${c.value}`}
                        </td>
                        <td>₹{c.maxDiscount?.toFixed(2)}</td>
                        <td>₹{c.minBookingAmount?.toFixed(2)}</td>
                        <td>
                          <span className="badge badge-status-confirmed">ACTIVE</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Bookings & Refunds Audit */}
        {activeTab === 'bookings' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3 style={{ fontSize: '18px' }}>Platform Bookings & Transactions</h3>
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  Audit transactions, customer receipts, and manage cancellations
                </div>
              </div>

              <div style={{ position: 'relative', minWidth: '240px' }}>
                <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="input-field"
                  style={{ paddingLeft: '32px' }}
                  placeholder="Filter by ref, movie, email..."
                  value={bookingSearch}
                  onChange={e => setBookingSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Customer</th>
                    <th>Movie & Timing</th>
                    <th>Seats</th>
                    <th>Total Paid</th>
                    <th>Payment Info</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings
                    .filter(b =>
                      !bookingSearch ||
                      b.bookingReference.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                      b.userName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                      b.movieTitle.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                      b.userEmail.toLowerCase().includes(bookingSearch.toLowerCase())
                    )
                    .map(b => (
                      <tr key={b.id}>
                        <td>
                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent-primary)' }}>
                            {b.bookingReference}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{b.userName}</div>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{b.userEmail}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700 }}>{b.movieTitle}</div>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                            {b.showDate} at {b.showTime} ({b.format})
                          </div>
                        </td>
                        <td>{b.seats.map(s => s.seatNumber).join(', ')}</td>
                        <td style={{ fontWeight: 700 }}>₹{b.totalAmount.toFixed(2)}</td>
                        <td>
                          <div style={{ fontSize: '12px' }}>{b.payment?.method}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {b.payment?.paymentId?.slice(0, 14)}</div>
                        </td>
                        <td>
                          {b.bookingStatus === 'CONFIRMED' ? (
                            <span className="badge badge-status-confirmed">CONFIRMED</span>
                          ) : (
                            <span className="badge badge-status-refunded">REFUNDED</span>
                          )}
                        </td>
                        <td>
                          {b.bookingStatus === 'CONFIRMED' && (
                            <button
                              className="btn btn-outline btn-sm"
                              style={{ color: '#f87171', fontSize: '11.5px' }}
                              onClick={() => handleAdminCancelBooking(b.id)}
                            >
                              Cancel / Refund
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Audit Logs */}
        {activeTab === 'logs' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3 style={{ fontSize: '18px' }}>System Activity & Security Audit Logs</h3>
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  Chronological event ledger recording user actions, bookings, cancellations, and administrative adjustments
                </div>
              </div>

              <button className="btn btn-secondary btn-sm" onClick={() => { loggerService.clearLogs(); forceRefresh(); }}>
                Clear Logs
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '550px', overflowY: 'auto' }}>
              {logs.map(log => (
                <div
                  key={log.id}
                  style={{
                    background: 'var(--bg-tertiary)',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12.5px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      className={`badge ${
                        log.severity === 'ERROR'
                          ? 'badge-status-refunded'
                          : log.severity === 'AUDIT'
                          ? 'badge-status-confirmed'
                          : 'badge-cert'
                      }`}
                    >
                      {log.severity}
                    </span>
                    <span style={{ fontWeight: 700 }}>{log.action}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{JSON.stringify(log.details)}</span>
                  </div>

                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Movie Modal */}
      {showAddMovieModal && (
        <div className="modal-backdrop" onClick={() => setShowAddMovieModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3>Add New Movie</h3>
              <button className="modal-close-btn" onClick={() => setShowAddMovieModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateMovie}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="input-group">
                  <label className="input-label">Movie Title</label>
                  <input
                    type="text"
                    className="input-field"
                    value={movieForm.title}
                    onChange={e => setMovieForm({ ...movieForm, title: e.target.value })}
                    placeholder="e.g. Interstellar Odyssey"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="input-group">
                    <label className="input-label">Genre</label>
                    <select
                      className="input-field"
                      value={movieForm.genre}
                      onChange={e => setMovieForm({ ...movieForm, genre: e.target.value })}
                    >
                      <option value="Action">Action</option>
                      <option value="Sci-Fi">Sci-Fi</option>
                      <option value="Drama">Drama</option>
                      <option value="Thriller">Thriller</option>
                      <option value="Adventure">Adventure</option>
                      <option value="Animation">Animation</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Language</label>
                    <select
                      className="input-field"
                      value={movieForm.language}
                      onChange={e => setMovieForm({ ...movieForm, language: e.target.value })}
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Tamil">Tamil</option>
                      <option value="Telugu">Telugu</option>
                      <option value="Japanese">Japanese</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div className="input-group">
                    <label className="input-label">Duration (Minutes)</label>
                    <input
                      type="number"
                      className="input-field"
                      value={movieForm.durationMinutes}
                      onChange={e => setMovieForm({ ...movieForm, durationMinutes: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Certification</label>
                    <select
                      className="input-field"
                      value={movieForm.certification}
                      onChange={e => setMovieForm({ ...movieForm, certification: e.target.value })}
                    >
                      <option value="U">U (Universal)</option>
                      <option value="UA13+">UA13+</option>
                      <option value="UA16+">UA16+</option>
                      <option value="A">A (Adults Only)</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Status</label>
                    <select
                      className="input-field"
                      value={movieForm.status}
                      onChange={e => setMovieForm({ ...movieForm, status: e.target.value })}
                    >
                      <option value="NOW_SHOWING">NOW_SHOWING</option>
                      <option value="UPCOMING">UPCOMING</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Director</label>
                  <input
                    type="text"
                    className="input-field"
                    value={movieForm.director}
                    onChange={e => setMovieForm({ ...movieForm, director: e.target.value })}
                    placeholder="e.g. Christopher Nolan"
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Cast (Comma-separated)</label>
                  <input
                    type="text"
                    className="input-field"
                    value={movieForm.cast}
                    onChange={e => setMovieForm({ ...movieForm, cast: e.target.value })}
                    placeholder="e.g. Cillian Murphy, Florence Pugh, Matt Damon"
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Description / Synopsis</label>
                  <textarea
                    className="input-field"
                    rows={3}
                    value={movieForm.description}
                    onChange={e => setMovieForm({ ...movieForm, description: e.target.value })}
                    placeholder="Enter movie overview..."
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddMovieModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Movie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

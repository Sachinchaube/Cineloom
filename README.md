# Cineloom: Online Movie Ticket Booking Platform

Cineloom is a production-ready, high-performance web application for online movie ticket booking. Built with React and pure Vanilla CSS (with no Tailwind CSS), Cineloom delivers a modern customer ticketing experience, real-time seat locking with countdown timers, dynamic price computation, promo coupon validation, mock payment gateway channels, boarding-pass digital tickets with QR codes, cancellation refund calculations, a comprehensive Administrator Management Suite, and an integrated in-browser Automated Unit Test Suite.

---

## 1. Technology Stack

* **Frontend Framework**: React (v19)
* **Build Tool & Bundler**: Vite (v8)
* **Styling**: 100% Pure Vanilla CSS (CSS Custom Properties, Fluid Layouts, Keyframe Animations, Glassmorphic Overlays)
* **Icons**: Lucide React
* **State Management**: React Context API (`AuthContext`, `BookingContext`, `NotificationContext`)
* **Persistence Layer**: LocalStorage-backed service layer with pre-seeded relational datasets
* **Testing Framework**: Custom In-Browser Test Runner using the Arrange-Act-Assert (AAA) pattern

---

## 2. Core Architecture and Design Principles

Cineloom is engineered around a clean, layered architecture:

```
Presentation / Views (App.jsx, Modals, Views)
       │
       ▼
State & Context Layer (AuthContext, BookingContext, NotificationContext)
       │
       ▼
Domain & Service Layer (movieService, showService, seatService, pricingService, bookingService, cancellationService, loggerService)
       │
       ▼
Data Storage Layer (storageService, seedData, LocalStorage)
```

### Key Architectural Guidelines:
* **Separation of Concerns**: Controllers and React components focus purely on rendering and user interaction, delegating all domain logic and validation to dedicated service modules.
* **Pure Styling**: No CSS frameworks or utility libraries are used. Every component utilizes crafted tokens and scoped CSS classes.
* **Audit Logging**: Important application events (logins, registrations, reservations, payments, cancellations, and administrative modifications) are recorded in the structured activity ledger.
* **Defensive Validation**: Strict boundary checking on inputs, dates, seat boundaries, schedule intervals, and coupon thresholds.

---

## 3. User Roles and Permissions

The platform supports two distinct user roles:

### Customer
* Register an account, log in, and manage user profile.
* Browse now showing and upcoming movies.
* Filter movies by genre, language, format, and availability.
* Search catalog by movie title, director, or cast member.
* Select city locations and explore theatres and available showtimes.
* View interactive seat layouts and lock seats for 5 minutes.
* Apply promotional voucher codes for instant price discounts.
* Complete checkout via Credit/Debit Card, UPI QR, or Net Banking.
* Receive digital boarding pass tickets with unique booking references and QR codes.
* View historical bookings and cancel eligible tickets with instant refund calculations.

### Administrator
* Access the dedicated Administrator Management Suite.
* View aggregate KPI statistics (gross revenue, active movies, total bookings, cancellation ratio).
* Manage the movie catalog (create, edit, delete, toggle screening status).
* Schedule showtimes with real-time screen conflict collision detection.
* Configure dynamic pricing parameters (convenience fee, tax rate, weekend multiplier, max seat limit).
* Create and manage promotional discount vouchers.
* Inspect all platform transactions and customer receipts.
* Trigger administrative booking cancellations and refund overrides.
* Review chronological activity and security audit logs.

---

## 4. End-to-End Booking Workflow

The customer booking journey consists of the following steps:

1. **Movie Catalog Browsing**: View movie cards featuring high-resolution artwork, certifications (U, UA13+, UA16+, A), ratings, durations, and formats.
2. **Movie Details**: View synopsis, director, starring cast chips, trailer preview, and available formats.
3. **Theatre and Showtime Selection**: Choose from upcoming dates (Today, Tomorrow, and subsequent days), view theatres in the selected city with facility badges, and pick showtime slots with pricing indicators.
4. **Interactive Seat Matrix**:
   * Screen curvature visualization indicating viewing orientation.
   * Categorized tiers: Regular ($12.00), Premium ($16.50), and VIP Recliner ($22.00).
   * Color-coded states: Available, Selected, Booked, and Locked.
   * Maximum booking limit constraint (up to 8 seats per transaction).
5. **Seat Holding and Concurrency**:
   * Selecting seats locks them exclusively for 5 minutes.
   * Real-time countdown timer ensures seats are released automatically if payment is abandoned.
6. **Dynamic Price Breakdown**:
   * Base ticket price per tier.
   * Screen format adjustments (IMAX 3D +$4.00, 4DX +$5.00, Dolby +$3.00, 3D +$2.00).
   * Weekend multiplier (15% surcharge for Saturday and Sunday screenings).
   * Promotional coupon deductions.
   * Convenience charge ($1.50 per ticket) and GST/VAT (12%).
7. **Payment Processing**: Multi-channel checkout with simulated authorization, loading state, and error handling.
8. **Digital Boarding Pass**: Instant generation of ticket pass containing booking reference code (e.g. `CNL-782910`), QR matrix, and print capabilities.
9. **Booking History and Management**: Inspect active bookings or trigger policy-based cancellations.

---

## 5. Seat Locking and Concurrency Control

To prevent race conditions and duplicate reservations:
* When a customer advances to checkout, `seatService.lockSeats()` assigns a lock entry with a timestamp and expiration deadline (default 300 seconds).
* Any attempt by another user to select a locked seat returns a clear error message.
* `seatService.cleanExpiredLocks()` sweeps expired holds before any layout generation or booking action.
* Upon successful payment, seats transition permanently from `locked` to `bookedSeats`.
* If checkout is cancelled or times out, the lock is removed and seats return to the `available` pool.

---

## 6. Dynamic Pricing and Offer Vouchers

The pricing engine (`pricingService.js`) dynamically computes ticket totals:

$$\text{Seat Rate} = (\text{Base Tier Price} + \text{Format Surcharge}) \times \text{Weekend Multiplier}$$

$$\text{Subtotal} = \sum \text{Seat Rate} - \text{Coupon Discount}$$

$$\text{Convenience Fee} = \text{Fee Per Ticket} \times \text{Seat Count}$$

$$\text{Tax Amount} = (\text{Subtotal} + \text{Convenience Fee}) \times \text{Tax Rate}$$

$$\text{Final Total} = \text{Subtotal} + \text{Convenience Fee} + \text{Tax Amount}$$

### Default Promo Codes:
* `CINELOOM20`: 20% discount up to $10.00 (min. subtotal $20.00)
* `FIRSTSHOW`: Flat $8.00 discount (min. subtotal $25.00)
* `VIPEXPERIENCE`: 15% discount on premium screenings (min. subtotal $35.00)

---

## 7. Cancellation and Refund Policy

Cineloom applies an automated time-window refund calculation:

| Time Remaining Until Showtime | Refund Percentage (Base Ticket Subtotal) | Convenience Fee Status |
| :--- | :--- | :--- |
| **Greater than 2 hours** | **80% Refund** | Retained (Non-refundable) |
| **Between 1 and 2 hours** | **50% Refund** | Retained (Non-refundable) |
| **Less than 1 hour / Past** | **0% Refund (Ineligible)** | Retained (Non-refundable) |

When a cancellation is processed:
1. Cancellation eligibility and exact refund amounts are computed.
2. The booking status is updated to `REFUNDED`.
3. Seats are freed in the screening record for immediate re-booking.
4. An audit record with refund reference (e.g. `REF-172384910`) is recorded.

---

## 8. Show Scheduling Conflict Detection Algorithm

To prevent double-booking cinema screens:
* When an administrator schedules a new screening, `showService.checkScheduleConflict()` parses start times and movie durations into minute intervals.
* A 20-minute cleaning and intermission buffer is appended to the screening duration.
* The algorithm checks for time interval intersection across all existing active shows on the specified screen and date:

$$\text{Overlap} \iff (\text{New Start} < \text{Existing End}) \land (\text{New End} > \text{Existing Start})$$

* If an overlap is detected, the conflict is displayed with the title and timeslot of the blocking show, and scheduling is blocked.

---

## 9. Automated In-Browser Unit Test Suite

The project includes an embedded unit test suite accessible via the **Unit Tests** tab in the navigation bar.

The test runner implements the Arrange-Act-Assert (AAA) pattern and covers 16 test cases across 6 suites:

1. **Authentication and Security Suite**:
   * Positive: Successful registration of new customer accounts.
   * Negative: Rejection of duplicate email registrations.
   * Negative: Authentication failure on invalid password credentials.
2. **Movie Catalog and Search Suite**:
   * Positive: Multi-filter combinations across genre and language.
   * Positive: Partial title search matching.
   * Edge Case: Resilient handling of non-matching queries returning empty datasets.
3. **Show Scheduling and Collision Suite**:
   * Negative: Conflict detection blocking overlapping screening intervals.
   * Business Rule: Prevention of scheduling shows for movies not marked as `NOW_SHOWING`.
4. **Seat Matrix and Concurrency Suite**:
   * Positive: Seat locking and expiration timestamp generation.
   * Concurrency: Isolation blocking simultaneous seat reservation attempts.
   * Edge Case: Enforcement of maximum seat limits (8 seats per transaction).
5. **Pricing and Coupon Calculations Suite**:
   * Positive: Multi-tier price computation with taxes and convenience charges.
   * Positive: Percentage discount calculation with maximum cap enforcement.
   * Negative: Rejection of coupons when booking subtotal is below minimum threshold.
6. **Booking and Payment Suite**:
   * Positive: Unique booking reference generation (`CNL-XXXXXX`).
   * Positive: End-to-end booking confirmation and seat transition.
   * Negative: Transaction rollback and seat retention upon payment decline.
7. **Cancellation and Refund Suite**:
   * Positive: Correct calculation of 80% refund tier (>2 hours before show).
   * Positive: Booking status update and seat release verification.

---

## 10. Project Directory Structure

```
c:/Users/HP/Desktop/Online_MovieTicket/
├── index.html                    # Root HTML document with Google Fonts & metadata
├── package.json                  # Dependencies and build scripts
├── vite.config.js                # Vite build configuration
├── src/
│   ├── main.jsx                  # React application entrypoint
│   ├── App.jsx                   # Primary route and modal orchestrator
│   ├── data/
│   │   └── seedData.js           # Initial movies, theatres, pricing, coupons, users
│   ├── context/
│   │   ├── AuthContext.jsx       # User authentication and session management
│   │   ├── BookingContext.jsx    # Live seat locking, pricing, and checkout state
│   │   └── NotificationContext.jsx # Centralized toast notifications
│   ├── services/
│   │   ├── storageService.js     # LocalStorage persistence manager
│   │   ├── authService.js        # Authentication and authorization logic
│   │   ├── movieService.js       # Catalog CRUD, search, and filtering
│   │   ├── theatreService.js     # Theatre and screen management
│   │   ├── showService.js        # Show scheduling and screen conflict detector
│   │   ├── seatService.js        # Seat layout matrix, locking, and concurrency
│   │   ├── pricingService.js     # Dynamic fee, tax, surcharge, and coupon engine
│   │   ├── bookingService.js     # Booking reference generator and mock payment
│   │   ├── cancellationService.js # Refund tier calculator and cancellation processor
│   │   └── loggerService.js      # Structured audit logging ledger
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx        # Navigation bar with search and city switcher
│   │   │   ├── Footer.jsx        # Footer with legal and security badges
│   │   │   ├── AuthModal.jsx     # Login/Register modal with demo profiles
│   │   │   └── ToastContainer.jsx # Toast notification alert system
│   │   ├── customer/
│   │   │   ├── HeroBanner.jsx    # Featured movie showcase
│   │   │   ├── MovieFilters.jsx  # Status, genre, language, and format filters
│   │   │   ├── MovieCard.jsx     # Movie card with ratings and book CTA
│   │   │   ├── MovieDetailsModal.jsx # Synopsis, cast, and screening details
│   │   │   ├── TheatreShowSelector.jsx # Date ribbon and theatre showtimes
│   │   │   └── OffersView.jsx    # Promotional coupons catalog
│   │   ├── booking/
│   │   │   ├── SeatLayoutModal.jsx # Curved screen and interactive seat matrix
│   │   │   ├── BookingSummaryModal.jsx # Itemized price breakdown and promo code input
│   │   │   ├── PaymentModal.jsx  # Card, UPI, and Net Banking payment gateway
│   │   │   ├── TicketPassModal.jsx # Digital boarding pass with QR code
│   │   │   └── BookingHistoryModal.jsx # Booking history and cancellation refund modal
│   │   ├── admin/
│   │   │   └── AdminPortal.jsx   # KPI dashboard, catalog manager, and scheduler
│   │   └── tests/
│   │       └── UnitTestRunner.jsx # In-browser test runner interface
│   ├── styles/
│   │   ├── index.css             # Base reset, typography, and design tokens
│   │   ├── animations.css        # Keyframe animations and transitions
│   │   ├── customer.css          # Customer UI, seat grid, and ticket styles
│   │   ├── admin.css             # Administrator dashboard and table styling
│   │   └── unittests.css         # Test runner and assertion styling
│   └── tests/
│       └── unitTests.js          # 16 automated unit test cases (AAA pattern)
```

---

## 11. Getting Started & Local Setup

### Prerequisites
* Node.js (v18 or higher)
* npm (v9 or higher)

### Installation Steps

1. Clone or open the repository folder:
```bash
cd Online_MovieTicket
```

2. Install dependencies:
```bash
npm install
```

3. Start the local development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173/
```

5. To verify production bundling:
```bash
npm run build
```

---

## 12. Default Demo Credentials

Pre-configured accounts are available for testing:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@cineloom.com` | `password123` | Book tickets, view history, cancel bookings |
| **Administrator** | `admin@cineloom.com` | `adminpassword` | Full administrative suite, scheduler, pricing |

*Tip: Quick login buttons are provided on the sign-in modal for one-click access.*

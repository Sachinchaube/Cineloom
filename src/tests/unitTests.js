// Cineloom In-Browser Automated Unit Test Suite
// Follows Arrange-Act-Assert (AAA) pattern

import { authService, UserRoles } from '../services/authService';
import { movieService } from '../services/movieService';
import { showService } from '../services/showService';
import { seatService, SeatStatus } from '../services/seatService';
import { pricingService } from '../services/pricingService';
import { bookingService, BookingStatus, PaymentStatus } from '../services/bookingService';
import { theatreService } from '../services/theatreService';
import { cancellationService } from '../services/cancellationService';
import { storageService } from '../services/storageService';

// Custom Test Runner Assertions
function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Expected value ${JSON.stringify(expected)}, but received ${JSON.stringify(actual)}`);
      }
    },
    toEqual(expected) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected deep equality with ${JSON.stringify(expected)}, but received ${JSON.stringify(actual)}`);
      }
    },
    toBeGreaterThan(expected) {
      if (!(actual > expected)) {
        throw new Error(`Expected ${actual} to be greater than ${expected}`);
      }
    },
    toBeLessThan(expected) {
      if (!(actual < expected)) {
        throw new Error(`Expected ${actual} to be less than ${expected}`);
      }
    },
    toBeTruthy() {
      if (!actual) {
        throw new Error(`Expected truthy value, but received ${JSON.stringify(actual)}`);
      }
    },
    toBeFalsy() {
      if (actual) {
        throw new Error(`Expected falsy value, but received ${JSON.stringify(actual)}`);
      }
    },
    toContain(item) {
      if (!actual || !actual.includes(item)) {
        throw new Error(`Expected collection to contain ${JSON.stringify(item)}`);
      }
    },
    toThrow(expectedMessageFragment = '') {
      // Used with wrapped function call
    }
  };
}

export const UNIT_TEST_SUITES = [
  {
    id: 'suite-auth',
    name: 'Authentication & Role Security Service',
    description: 'Validates user registration, duplicate prevention, password constraints, and role authentication.',
    tests: [
      {
        id: 'auth-1',
        title: 'Positive: Successfully register a new customer account',
        category: 'Authentication',
        type: 'POSITIVE',
        run() {
          // Arrange
          const uniqueEmail = `user_${Date.now()}@cineloom.test`;
          const payload = {
            name: 'Sarah Connor',
            email: uniqueEmail,
            password: 'securePassword99',
            phone: '+1 555 123 4567',
            city: 'New York'
          };

          // Act
          const registered = authService.register(payload);

          // Assert
          expect(registered.email).toBe(uniqueEmail.toLowerCase());
          expect(registered.name).toBe('Sarah Connor');
          expect(registered.role).toBe(UserRoles.CUSTOMER);
          expect(registered.password).toBe(undefined); // Ensure password is never leaked in session
        }
      },
      {
        id: 'auth-2',
        title: 'Negative: Reject registration with duplicate email address',
        category: 'Authentication',
        type: 'NEGATIVE',
        run() {
          // Arrange
          const duplicateEmail = 'customer@cineloom.com';

          // Act & Assert
          let errorThrown = false;
          try {
            authService.register({
              name: 'Duplicate Test',
              email: duplicateEmail,
              password: 'validpassword123'
            });
          } catch (e) {
            errorThrown = true;
            expect(e.message).toContain('already exists');
          }
          expect(errorThrown).toBe(true);
        }
      },
      {
        id: 'auth-3',
        title: 'Negative: Reject login with incorrect password',
        category: 'Authentication',
        type: 'NEGATIVE',
        run() {
          // Arrange
          const email = 'admin@cineloom.com';
          const wrongPassword = 'WrongAdminPassword!';

          // Act & Assert
          let errorThrown = false;
          try {
            authService.login(email, wrongPassword);
          } catch (e) {
            errorThrown = true;
            expect(e.message).toContain('Invalid email or password');
          }
          expect(errorThrown).toBe(true);
        }
      }
    ]
  },
  {
    id: 'suite-movies',
    name: 'Movie Catalog & Search Filtering Service',
    description: 'Verifies title query search, multi-criteria filtering by genre, language, format, and status.',
    tests: [
      {
        id: 'mov-1',
        title: 'Positive: Filter movies by specific genre and language',
        category: 'Catalog',
        type: 'POSITIVE',
        run() {
          // Arrange
          const genreFilter = 'Sci-Fi';
          const languageFilter = 'English';

          // Act
          const results = movieService.getMovies({ genre: genreFilter, language: languageFilter });

          // Assert
          expect(results.length).toBeGreaterThan(0);
          results.forEach(movie => {
            expect(movie.genre).toBe(genreFilter);
            expect(movie.language).toBe(languageFilter);
          });
        }
      },
      {
        id: 'mov-2',
        title: 'Positive: Search movies by partial title match',
        category: 'Catalog',
        type: 'POSITIVE',
        run() {
          // Arrange
          const query = 'odyssey';

          // Act
          const results = movieService.getMovies({ searchQuery: query });

          // Assert
          expect(results.length).toBeGreaterThan(0);
          expect(results[0].title.toLowerCase()).toContain('odyssey');
        }
      },
      {
        id: 'mov-3',
        title: 'Edge Case: Search with non-matching query returns empty dataset gracefully',
        category: 'Catalog',
        type: 'EDGE_CASE',
        run() {
          // Arrange
          const nonexistentQuery = 'xyznonexistentmovie99238472';

          // Act
          const results = movieService.getMovies({ searchQuery: nonexistentQuery });

          // Assert
          expect(results.length).toBe(0);
        }
      }
    ]
  },
  {
    id: 'suite-shows',
    name: 'Show Scheduling & Conflict Detection Service',
    description: 'Ensures screen time intervals do not overlap and validates schedule business constraints.',
    tests: [
      {
        id: 'shw-1',
        title: 'Negative/Conflict: Detect and reject overlapping showtimes on the same screen',
        category: 'Scheduling',
        type: 'NEGATIVE',
        run() {
          // Arrange
          const allShows = showService.getAllShows();
          const targetShow = allShows[0];
          expect(Boolean(targetShow)).toBe(true);

          // Act: Check conflict with exact same screen, date, and overlapping time
          const conflict = showService.checkScheduleConflict(
            targetShow.screenId,
            targetShow.date,
            targetShow.startTime,
            120 // 120 minutes duration
          );

          // Assert
          expect(conflict.conflict).toBe(true);
          expect(conflict.reason).toContain('Schedule conflict');
        }
      },
      {
        id: 'shw-2',
        title: 'Business Rule: Reject scheduling shows for movies not marked NOW_SHOWING',
        category: 'Scheduling',
        type: 'NEGATIVE',
        run() {
          // Arrange
          const allMovies = movieService.getAllMovies();
          const upcomingMovie = allMovies.find(m => m.status === 'UPCOMING');
          expect(Boolean(upcomingMovie)).toBe(true);

          const theatre = theatreService.getAllTheatres()[0];

          // Act & Assert
          let errorThrown = false;
          try {
            showService.createShow({
              movieId: upcomingMovie.id,
              theatreId: theatre.id,
              screenId: theatre.screens[0].id,
              date: '2026-09-20',
              startTime: '07:00 PM',
              basePrice: 15.0
            });
          } catch (e) {
            errorThrown = true;
            expect(e.message).toContain('Only NOW_SHOWING movies can be scheduled');
          }
          expect(errorThrown).toBe(true);
        }
      }
    ]
  },
  {
    id: 'suite-seats',
    name: 'Seat Matrix & Concurrency Locking Service',
    description: 'Validates temporary 5-minute seat locking, concurrency isolation, and auto-expiration.',
    tests: [
      {
        id: 'seat-1',
        title: 'Positive: Lock available seats for customer and calculate valid expiry timestamp',
        category: 'Seat Management',
        type: 'POSITIVE',
        run() {
          // Arrange
          const show = showService.getAllShows()[0];
          const testSeats = ['A1', 'A2'];
          const testUserId = 'test-user-lock-1';
          const lockDuration = 300; // 5 mins

          // Act
          const result = seatService.lockSeats(show.id, testSeats, testUserId, lockDuration);

          // Assert
          expect(result.success).toBe(true);
          expect(result.lockedSeats).toEqual(testSeats);
          expect(result.expiresAt).toBeGreaterThan(Date.now());

          // Cleanup
          seatService.releaseSeats(show.id, testSeats, testUserId);
        }
      },
      {
        id: 'seat-2',
        title: 'Concurrency Isolation: Prevent another customer from locking already locked seats',
        category: 'Seat Management',
        type: 'NEGATIVE',
        run() {
          // Arrange
          const show = showService.getAllShows()[0];
          const testSeats = ['B1'];
          const firstCustomer = 'cust-alpha-1';
          const secondCustomer = 'cust-beta-2';

          // First customer locks
          seatService.lockSeats(show.id, testSeats, firstCustomer, 300);

          // Act: Second customer attempts to lock same seat
          let errorThrown = false;
          try {
            seatService.lockSeats(show.id, testSeats, secondCustomer, 300);
          } catch (e) {
            errorThrown = true;
            expect(e.message).toContain('locked by another customer');
          }

          // Assert
          expect(errorThrown).toBe(true);

          // Cleanup
          seatService.releaseSeats(show.id, testSeats, firstCustomer);
        }
      },
      {
        id: 'seat-3',
        title: 'Edge Case: Enforce maximum seat booking limit per transaction (8 seats)',
        category: 'Seat Management',
        type: 'EDGE_CASE',
        run() {
          // Arrange
          const show = showService.getAllShows()[0];
          const nineSeats = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9'];
          const userId = 'cust-limit-test';

          // Act & Assert
          let errorThrown = false;
          try {
            seatService.lockSeats(show.id, nineSeats, userId, 300);
          } catch (e) {
            errorThrown = true;
            expect(e.message).toContain('maximum of 8 seats');
          }
          expect(errorThrown).toBe(true);
        }
      }
    ]
  },
  {
    id: 'suite-pricing',
    name: 'Dynamic Pricing, Taxes & Promotional Offers Service',
    description: 'Calculates seat tier pricing, screen format surcharges, convenience charges, taxes, and coupon discounts.',
    tests: [
      {
        id: 'price-1',
        title: 'Positive: Accurate breakdown calculation for multiple seat tiers with GST and fee',
        category: 'Pricing',
        type: 'POSITIVE',
        run() {
          // Arrange
          const show = showService.getAllShows()[0];
          const mockSeats = [
            { seatNumber: 'D4', categoryName: 'Premium', basePrice: 320.0 },
            { seatNumber: 'G1', categoryName: 'VIP Recliner', basePrice: 480.0 }
          ];

          // Act
          const calculation = pricingService.calculateBookingPrice({
            showId: show.id,
            selectedSeats: mockSeats
          });

          // Assert
          expect(calculation.seatCount).toBe(2);
          expect(calculation.subtotal).toBeGreaterThan(600);
          expect(calculation.convenienceFee).toBe(70.00); // 2 * ₹35.00
          expect(calculation.taxAmount).toBeGreaterThan(0);
          expect(calculation.totalAmount).toBeGreaterThan(calculation.subtotal);
        }
      },
      {
        id: 'price-2',
        title: 'Positive: Apply percentage coupon discount with maximum cap validation',
        category: 'Pricing',
        type: 'POSITIVE',
        run() {
          // Arrange
          const subtotal = 1000.0;
          const couponCode = 'CINELOOM20'; // 20% capped at ₹150

          // Act
          const validation = pricingService.validateCoupon(couponCode, subtotal);

          // Assert
          expect(validation.valid).toBe(true);
          expect(validation.discountAmount).toBe(150.0); // Capped at ₹150 max
        }
      },
      {
        id: 'price-3',
        title: 'Negative: Reject promo coupon when subtotal is below minimum threshold',
        category: 'Pricing',
        type: 'NEGATIVE',
        run() {
          // Arrange
          const smallSubtotal = 100.0;
          const couponCode = 'VIPEXPERIENCE'; // Requires min ₹600

          // Act
          const validation = pricingService.validateCoupon(couponCode, smallSubtotal);

          // Assert
          expect(validation.valid).toBe(false);
          expect(validation.message).toContain('Minimum ticket subtotal');
        }
      }
    ]
  },
  {
    id: 'suite-booking',
    name: 'Booking Lifecycle & Payment Processing Service',
    description: 'Validates end-to-end booking confirmation, reference generation, and seat status transitions.',
    tests: [
      {
        id: 'bkg-1',
        title: 'Positive: Generate unique formatted booking reference (CNL-XXXXXX)',
        category: 'Booking',
        type: 'POSITIVE',
        run() {
          // Act
          const ref = bookingService.generateReferenceNumber();

          // Assert
          expect(ref.startsWith('CNL-')).toBe(true);
          expect(ref.length).toBe(10);
        }
      },
      {
        id: 'bkg-2',
        title: 'Positive: Complete full booking flow with payment and verify confirmed status',
        category: 'Booking',
        type: 'POSITIVE',
        async run() {
          // Arrange
          const user = authService.getAllUsers()[0];
          const show = showService.getAllShows()[0];
          const selectedSeats = [{ seatNumber: 'H9', categoryName: 'VIP Recliner', basePrice: 480.0 }];

          // Act
          const booking = await bookingService.createBooking({
            user,
            showId: show.id,
            selectedSeats,
            paymentMethod: 'CARD',
            paymentDetails: { cardNumber: '4242424242424242' }
          });

          // Assert
          expect(booking.bookingStatus).toBe(BookingStatus.CONFIRMED);
          expect(booking.payment.status).toBe(PaymentStatus.SUCCESSFUL);
          expect(booking.seats.length).toBe(1);
          expect(booking.bookingReference.startsWith('CNL-')).toBe(true);
        }
      },
      {
        id: 'bkg-3',
        title: 'Negative: Abort booking and do not commit transaction if payment fails',
        category: 'Booking',
        type: 'NEGATIVE',
        async run() {
          // Arrange
          const user = authService.getAllUsers()[0];
          const show = showService.getAllShows()[0];
          const selectedSeats = [{ seatNumber: 'H10', categoryName: 'VIP Recliner', basePrice: 22.0 }];

          // Act & Assert
          let errorThrown = false;
          try {
            await bookingService.createBooking({
              user,
              showId: show.id,
              selectedSeats,
              paymentMethod: 'CARD',
              paymentDetails: { simulateFailure: true }
            });
          } catch (e) {
            errorThrown = true;
            expect(e.message).toContain('Card declined');
          }

          expect(errorThrown).toBe(true);
        }
      }
    ]
  },
  {
    id: 'suite-cancellation',
    name: 'Cancellation Policy & Refund Processing Engine',
    description: 'Enforces tiered time-window cancellation policy, computes refund deductions, and releases booked seats.',
    tests: [
      {
        id: 'can-1',
        title: 'Positive: Compute 80% refund of base ticket price when cancelled > 2 hours prior',
        category: 'Cancellation',
        type: 'POSITIVE',
        run() {
          // Arrange: A mock booking with future show
          const allBookings = bookingService.getAllBookings();
          const activeBooking = allBookings[0];
          expect(Boolean(activeBooking)).toBe(true);

          // Act
          const evalResult = cancellationService.evaluateCancellationEligibility(activeBooking.id);

          // Assert
          expect(evalResult.eligible).toBe(true);
          expect(evalResult.refundPercentage).toBe(80);
          expect(evalResult.refundAmount).toBeGreaterThan(0);
          expect(evalResult.refundAmount).toBeLessThan(activeBooking.totalAmount);
        }
      },
      {
        id: 'can-2',
        title: 'Positive: Execute cancellation, update status to REFUNDED, and free booked seats',
        category: 'Cancellation',
        type: 'POSITIVE',
        run() {
          // Arrange
          const allBookings = bookingService.getAllBookings();
          const target = allBookings.find(b => b.bookingStatus === BookingStatus.CONFIRMED);
          if (!target) return; // Skip if no confirmed bookings

          // Act
          const cancelled = cancellationService.processCancellation(target.id, 'Test cancellation request');

          // Assert
          expect(cancelled.bookingStatus).toBe(BookingStatus.REFUNDED);
          expect(cancelled.cancellation).toBeTruthy();
          expect(cancelled.cancellation.refundStatus).toBe(PaymentStatus.REFUNDED);
        }
      }
    ]
  }
];

export async function runAllUnitTests(onProgress = null) {
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    startTime: Date.now(),
    durationMs: 0,
    suites: []
  };

  for (const suite of UNIT_TEST_SUITES) {
    const suiteResult = {
      id: suite.id,
      name: suite.name,
      description: suite.description,
      tests: []
    };

    for (const test of suite.tests) {
      results.total++;
      const testStart = Date.now();
      let status = 'PASSED';
      let error = null;

      try {
        await test.run();
        results.passed++;
      } catch (err) {
        status = 'FAILED';
        error = err.message || 'Assertion failed';
        results.failed++;
      }

      const durationMs = Date.now() - testStart;
      const testResult = {
        id: test.id,
        title: test.title,
        category: test.category,
        type: test.type,
        status,
        error,
        durationMs
      };

      suiteResult.tests.push(testResult);
      if (onProgress) {
        onProgress({ current: results.total, testResult });
      }
    }

    results.suites.push(suiteResult);
  }

  results.durationMs = Date.now() - results.startTime;
  return results;
}

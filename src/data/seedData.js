// Cineloom Master Seed Data

export const INITIAL_GENRES = [
  'All Genres',
  'Action',
  'Sci-Fi',
  'Drama',
  'Thriller',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime'
];

export const INITIAL_LANGUAGES = [
  'All Languages',
  'English',
  'Hindi',
  'Tamil',
  'Telugu',
  'Spanish',
  'Japanese'
];

export const INITIAL_FORMATS = [
  'All Formats',
  '2D',
  '3D',
  'IMAX 3D',
  '4DX',
  'Dolby Cinema'
];

export const INITIAL_CITIES = [
  'New York',
  'Los Angeles',
  'Chicago',
  'London',
  'Toronto',
  'Mumbai'
];

export const INITIAL_MOVIES = [
  {
    id: 'mov-1',
    title: 'The Odyssey: Horizon of Stars',
    genre: 'Sci-Fi',
    language: 'English',
    formats: ['2D', '3D', 'IMAX 3D'],
    duration: '162 min',
    durationMinutes: 162,
    certification: 'UA16+',
    rating: 9.2,
    votes: '48.2k',
    releaseDate: '2026-08-10',
    status: 'NOW_SHOWING',
    director: 'Denis Villeneuve',
    cast: ['Cillian Murphy', 'Rebecca Ferguson', 'Oscar Isaac', 'Florence Pugh'],
    description: 'When an uncharted gravitational anomaly emerges on the edge of the solar system, a crew of veteran interstellar navigators embarks on a mission to decode a signal that threatens terrestrial stability.',
    bannerUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    featured: true
  },
  {
    id: 'mov-2',
    title: 'Batwara 1947: Echoes of Freedom',
    genre: 'Drama',
    language: 'Hindi',
    formats: ['2D', 'Dolby Cinema'],
    duration: '148 min',
    durationMinutes: 148,
    certification: 'A',
    rating: 8.8,
    votes: '32.1k',
    releaseDate: '2026-08-12',
    status: 'NOW_SHOWING',
    director: 'Shoojit Sircar',
    cast: ['Vicky Kaushal', 'Kay Kay Menon', 'Radhika Apte', 'Manoj Bajpayee'],
    description: 'An evocative historical saga chronicling three interwoven families grappling with loyalty, fractured borders, and resilience during the turbulent partition of 1947.',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    featured: true
  },
  {
    id: 'mov-3',
    title: 'Awarapan 2: Redemption Song',
    genre: 'Action',
    language: 'Hindi',
    formats: ['2D', '4DX'],
    duration: '135 min',
    durationMinutes: 135,
    certification: 'UA16+',
    rating: 8.6,
    votes: '27.4k',
    releaseDate: '2026-08-14',
    status: 'NOW_SHOWING',
    director: 'Mohit Suri',
    cast: ['Emraan Hashmi', 'Prithviraj Sukumaran', 'Shraddha Kapoor'],
    description: 'A reformed enforcer is pulled back into the neon-drenched underworld when a ghost from his past pleads for salvation across international boundaries.',
    bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    featured: false
  },
  {
    id: 'mov-4',
    title: 'The End of Oak Street',
    genre: 'Thriller',
    language: 'English',
    formats: ['2D', '3D', 'Dolby Cinema'],
    duration: '118 min',
    durationMinutes: 118,
    certification: 'A',
    rating: 8.9,
    votes: '19.8k',
    releaseDate: '2026-08-15',
    status: 'NOW_SHOWING',
    director: 'Jordan Peele',
    cast: ['Daniel Kaluuya', 'Anya Taylor-Joy', 'Steven Yeun'],
    description: 'When a gated suburban enclave is sealed off under mystery quarantine protocols, two neighboring families discover that the true threat is already inside.',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    featured: false
  },
  {
    id: 'mov-5',
    title: 'Vishwanath & Sons',
    genre: 'Drama',
    language: 'Tamil',
    formats: ['2D', 'Dolby Cinema'],
    duration: '154 min',
    durationMinutes: 154,
    certification: 'UA16+',
    rating: 9.0,
    votes: '35.6k',
    releaseDate: '2026-08-11',
    status: 'NOW_SHOWING',
    director: 'Mani Ratnam',
    cast: ['Suriya', 'Fahadh Faasil', 'Sai Pallavi', 'Prakash Raj'],
    description: 'An intense corporate and familial duel unfolds over a generational maritime empire as sibling rivalries collide with modern economic ambition.',
    bannerUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=800&q=80',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    featured: false
  },
  {
    id: 'mov-6',
    title: 'Magudam: The Crowned Throne',
    genre: 'Action',
    language: 'Tamil',
    formats: ['2D', '3D', 'IMAX 3D'],
    duration: '168 min',
    durationMinutes: 168,
    certification: 'UA16+',
    rating: 8.7,
    votes: '41.0k',
    releaseDate: '2026-08-08',
    status: 'NOW_SHOWING',
    director: 'Lokesh Kanagaraj',
    cast: ['Kamal Haasan', 'Vijay Sethupathi', 'Karthi'],
    description: 'A relentless espionage thriller tracing a clandestine task force tasked with recovering stolen national defense artifacts from a global cartel syndicate.',
    bannerUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    featured: false
  },
  {
    id: 'mov-7',
    title: 'Chronicles of Neo Kyoto',
    genre: 'Animation',
    language: 'Japanese',
    formats: ['2D', 'IMAX 3D'],
    duration: '112 min',
    durationMinutes: 112,
    certification: 'UA13+',
    rating: 9.3,
    votes: '24.7k',
    releaseDate: '2026-08-28',
    status: 'UPCOMING',
    director: 'Makoto Shinkai',
    cast: ['Ryunosuke Kamiki', 'Mone Kamishiraishi'],
    description: 'In a futuristic solar-powered Kyoto, a teenage roboticist and an environmental spirit discover a shared harmonic connection across split dimensions.',
    bannerUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1600&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    featured: false
  },
  {
    id: 'mov-8',
    title: 'Shadows of Olympus',
    genre: 'Adventure',
    language: 'English',
    formats: ['2D', '3D', 'IMAX 3D', '4DX'],
    duration: '142 min',
    durationMinutes: 142,
    certification: 'UA13+',
    rating: 8.5,
    votes: '18.3k',
    releaseDate: '2026-09-04',
    status: 'UPCOMING',
    director: 'Ridley Scott',
    cast: ['Paul Mescal', 'Pedro Pascal', 'Denzel Washington'],
    description: 'A grand mythological epic uncovering the forgotten civil conflict between Olympian sentinels and deep subterranean titans.',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1512070679279-8988d32161be?auto=format&fit=crop&w=800&q=80',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    featured: false
  }
];

export const INITIAL_THEATRES = [
  {
    id: 'th-1',
    name: 'Cineloom Luxe Grand',
    city: 'New York',
    location: '42nd St & Broadway, Manhattan',
    facilities: ['Dolby Atmos', 'Recliner Seats', 'Gourmet Dining', 'Valet Parking'],
    rating: 4.9,
    isActive: true,
    screens: [
      { id: 'scr-101', name: 'Screen 1 (IMAX Laser)', format: 'IMAX 3D', capacity: 64, type: 'IMAX' },
      { id: 'scr-102', name: 'Screen 2 (Dolby Atmos)', format: 'Dolby Cinema', capacity: 56, type: 'Dolby' },
      { id: 'scr-103', name: 'Screen 3 (VIP Royal)', format: '2D', capacity: 40, type: 'VIP' }
    ]
  },
  {
    id: 'th-2',
    name: 'Cineloom Sapphire Multiplex',
    city: 'New York',
    location: 'Queens Boulevard, Long Island City',
    facilities: ['4DX Motion', '4K Projection', 'Cafe Lounge'],
    rating: 4.7,
    isActive: true,
    screens: [
      { id: 'scr-201', name: 'Screen 1 (4DX Experience)', format: '4DX', capacity: 48, type: '4DX' },
      { id: 'scr-202', name: 'Screen 2 (Standard 3D)', format: '3D', capacity: 64, type: 'Standard' }
    ]
  },
  {
    id: 'th-3',
    name: 'Cineloom Metropolis Cinema',
    city: 'Los Angeles',
    location: 'Sunset Boulevard, Hollywood',
    facilities: ['IMAX 70mm', 'Bar & Lounge', 'Laser Projection'],
    rating: 4.8,
    isActive: true,
    screens: [
      { id: 'scr-301', name: 'Auditorium 1 (IMAX)', format: 'IMAX 3D', capacity: 72, type: 'IMAX' },
      { id: 'scr-302', name: 'Auditorium 2 (Dolby)', format: '2D', capacity: 56, type: 'Dolby' }
    ]
  },
  {
    id: 'th-4',
    name: 'Cineloom Pavilion Arts',
    city: 'London',
    location: 'Leicester Square, West End',
    facilities: ['VIP Suites', 'Dolby Vision', 'Premium Concessions'],
    rating: 4.9,
    isActive: true,
    screens: [
      { id: 'scr-401', name: 'Royal Screen (Dolby Cinema)', format: 'Dolby Cinema', capacity: 64, type: 'Dolby' },
      { id: 'scr-402', name: 'Studio Screen (2D)', format: '2D', capacity: 48, type: 'Standard' }
    ]
  }
];

export const INITIAL_SEAT_CATEGORIES = [
  {
    id: 'cat-regular',
    name: 'Regular',
    basePrice: 12.0,
    rows: ['A', 'B', 'C'],
    description: 'Comfortable standard viewing rows'
  },
  {
    id: 'cat-premium',
    name: 'Premium',
    basePrice: 16.5,
    rows: ['D', 'E', 'F'],
    description: 'Optimum center viewing angle with extra legroom'
  },
  {
    id: 'cat-vip',
    name: 'VIP Recliner',
    basePrice: 22.0,
    rows: ['G', 'H'],
    description: 'Full leather recliner seats with dedicated service'
  }
];

// Helper to generate shows for today and upcoming 4 days
export function generateInitialShows() {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 5; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }

  const times = ['10:30 AM', '01:45 PM', '05:15 PM', '08:45 PM', '11:15 PM'];
  const shows = [];
  let counter = 1;

  const nowShowingMovies = INITIAL_MOVIES.filter(m => m.status === 'NOW_SHOWING');

  INITIAL_THEATRES.forEach(theatre => {
    theatre.screens.forEach(screen => {
      dates.forEach(date => {
        times.forEach((time, tIdx) => {
          const movie = nowShowingMovies[(counter + tIdx) % nowShowingMovies.length];
          const showId = `shw-${theatre.id}-${screen.id}-${date}-${tIdx + 1}`;
          
          shows.push({
            id: showId,
            movieId: movie.id,
            movieTitle: movie.title,
            theatreId: theatre.id,
            theatreName: theatre.name,
            screenId: screen.id,
            screenName: screen.name,
            format: screen.format,
            date: date,
            startTime: time,
            endTime: calculateEndTime(time, movie.durationMinutes || 140),
            basePrice: screen.format.includes('IMAX') ? 18.0 : screen.format.includes('4DX') ? 19.5 : 14.0,
            isActive: true,
            bookedSeats: generatePreBookedSeats(date, tIdx),
            lockedSeats: {} // seatNumber: timestamp
          });
          counter++;
        });
      });
    });
  });

  return shows;
}

function calculateEndTime(startTimeStr, durationMinutes) {
  const [time, modifier] = startTimeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  const startTotalMinutes = hours * 60 + minutes;
  const endTotalMinutes = (startTotalMinutes + durationMinutes + 20) % 1440; // 20 min buffer
  const endHours = Math.floor(endTotalMinutes / 60);
  const endMins = endTotalMinutes % 60;

  const endPeriod = endHours >= 12 ? 'PM' : 'AM';
  const displayHours = endHours % 12 === 0 ? 12 : endHours % 12;
  return `${String(displayHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')} ${endPeriod}`;
}

function generatePreBookedSeats(date, timeIdx) {
  // Deterministic pre-booked seats for demo realism
  if (timeIdx === 2 || timeIdx === 3) {
    return ['D4', 'D5', 'E6', 'E7', 'G3', 'G4'];
  }
  return ['C3', 'C4'];
}

export const INITIAL_COUPONS = [
  {
    code: 'CINELOOM20',
    description: '20% off on all movie tickets up to $10',
    discountType: 'PERCENTAGE',
    value: 20,
    maxDiscount: 10.0,
    minBookingAmount: 20.0,
    expiryDate: '2026-12-31',
    isActive: true
  },
  {
    code: 'FIRSTSHOW',
    description: 'Flat $8 discount on your first booking',
    discountType: 'FLAT',
    value: 8.0,
    maxDiscount: 8.0,
    minBookingAmount: 25.0,
    expiryDate: '2026-12-31',
    isActive: true
  },
  {
    code: 'VIPEXPERIENCE',
    description: '15% instant discount on VIP Recliner bookings',
    discountType: 'PERCENTAGE',
    value: 15,
    maxDiscount: 15.0,
    minBookingAmount: 35.0,
    expiryDate: '2026-12-31',
    isActive: true
  }
];

export const INITIAL_PRICING_CONFIG = {
  convenienceFeePerTicket: 1.50,
  taxRatePercent: 12.0, // 12% GST/VAT
  weekendSurchargeMultiplier: 1.15,
  eveningSurchargeMultiplier: 1.10,
  maxSeatsPerBooking: 8,
  seatLockDurationSeconds: 300 // 5 minutes
};

export const CANCELLATION_POLICY = {
  rules: [
    {
      hoursBeforeShow: 2.0,
      refundPercentage: 80,
      description: 'More than 2 hours before showtime: 80% refund of base ticket price'
    },
    {
      hoursBeforeShow: 1.0,
      refundPercentage: 50,
      description: 'Between 1 and 2 hours before showtime: 50% refund of base ticket price'
    },
    {
      hoursBeforeShow: 0,
      refundPercentage: 0,
      description: 'Less than 1 hour or after show start: Non refundable'
    }
  ],
  convenienceFeeRefundable: false
};

export const INITIAL_USERS = [
  {
    id: 'usr-customer-1',
    name: 'Alex Mercer',
    email: 'customer@cineloom.com',
    password: 'password123',
    phone: '+1 555 019 2834',
    role: 'CUSTOMER',
    city: 'New York',
    createdAt: '2026-08-01'
  },
  {
    id: 'usr-admin-1',
    name: 'Victoria Vance',
    email: 'admin@cineloom.com',
    password: 'adminpassword',
    phone: '+1 555 948 2011',
    role: 'ADMINISTRATOR',
    city: 'New York',
    createdAt: '2026-08-01'
  }
];

export const INITIAL_BOOKINGS = [
  {
    id: 'bkg-1001',
    bookingReference: 'CNL-782910',
    userId: 'usr-customer-1',
    userName: 'Alex Mercer',
    userEmail: 'customer@cineloom.com',
    showId: 'shw-th-1-scr-101-2026-08-16-3',
    movieId: 'mov-1',
    movieTitle: 'The Odyssey: Horizon of Stars',
    theatreId: 'th-1',
    theatreName: 'Cineloom Luxe Grand',
    theatreLocation: '42nd St & Broadway, Manhattan',
    screenName: 'Screen 1 (IMAX Laser)',
    format: 'IMAX 3D',
    showDate: '2026-08-16',
    showTime: '05:15 PM',
    seats: [
      { seatNumber: 'E6', category: 'Premium', price: 18.0 },
      { seatNumber: 'E7', category: 'Premium', price: 18.0 }
    ],
    seatCount: 2,
    subtotal: 36.0,
    discountAmount: 7.20,
    appliedCoupon: 'CINELOOM20',
    convenienceFee: 3.00,
    taxAmount: 3.82,
    totalAmount: 35.62,
    payment: {
      paymentId: 'pay-tx-84910',
      method: 'CARD',
      status: 'SUCCESSFUL',
      cardLast4: '4242',
      timestamp: '2026-08-16T10:30:00Z'
    },
    bookingStatus: 'CONFIRMED',
    createdAt: '2026-08-16T10:30:00Z'
  }
];

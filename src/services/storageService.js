// Storage Service for Cineloom
import {
  INITIAL_MOVIES,
  INITIAL_THEATRES,
  INITIAL_SEAT_CATEGORIES,
  INITIAL_COUPONS,
  INITIAL_PRICING_CONFIG,
  CANCELLATION_POLICY,
  INITIAL_USERS,
  INITIAL_BOOKINGS,
  generateInitialShows
} from '../data/seedData';

const KEYS = {
  MOVIES: 'cineloom_movies',
  THEATRES: 'cineloom_theatres',
  SHOWS: 'cineloom_shows',
  SEAT_CATEGORIES: 'cineloom_seat_categories',
  COUPONS: 'cineloom_coupons',
  PRICING: 'cineloom_pricing_config',
  POLICY: 'cineloom_cancellation_policy',
  USERS: 'cineloom_users',
  CURRENT_USER: 'cineloom_current_user',
  BOOKINGS: 'cineloom_bookings',
  LOGS: 'cineloom_logs',
  SELECTED_CITY: 'cineloom_selected_city'
};

export const storageService = {
  initialize() {
    if (!localStorage.getItem(KEYS.MOVIES)) {
      localStorage.setItem(KEYS.MOVIES, JSON.stringify(INITIAL_MOVIES));
    }
    if (!localStorage.getItem(KEYS.THEATRES)) {
      localStorage.setItem(KEYS.THEATRES, JSON.stringify(INITIAL_THEATRES));
    }
    if (!localStorage.getItem(KEYS.SHOWS)) {
      localStorage.setItem(KEYS.SHOWS, JSON.stringify(generateInitialShows()));
    }
    if (!localStorage.getItem(KEYS.SEAT_CATEGORIES)) {
      localStorage.setItem(KEYS.SEAT_CATEGORIES, JSON.stringify(INITIAL_SEAT_CATEGORIES));
    }
    if (!localStorage.getItem(KEYS.COUPONS)) {
      localStorage.setItem(KEYS.COUPONS, JSON.stringify(INITIAL_COUPONS));
    }
    if (!localStorage.getItem(KEYS.PRICING)) {
      localStorage.setItem(KEYS.PRICING, JSON.stringify(INITIAL_PRICING_CONFIG));
    }
    if (!localStorage.getItem(KEYS.POLICY)) {
      localStorage.setItem(KEYS.POLICY, JSON.stringify(CANCELLATION_POLICY));
    }
    if (!localStorage.getItem(KEYS.USERS)) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(KEYS.BOOKINGS)) {
      localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    }
    if (!localStorage.getItem(KEYS.LOGS)) {
      localStorage.setItem(KEYS.LOGS, JSON.stringify([]));
    }
    if (!localStorage.getItem(KEYS.SELECTED_CITY)) {
      localStorage.setItem(KEYS.SELECTED_CITY, 'New York');
    }
  },

  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Storage get error for key:', key, e);
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage set error for key:', key, e);
    }
  },

  resetToDefault() {
    localStorage.setItem(KEYS.MOVIES, JSON.stringify(INITIAL_MOVIES));
    localStorage.setItem(KEYS.THEATRES, JSON.stringify(INITIAL_THEATRES));
    localStorage.setItem(KEYS.SHOWS, JSON.stringify(generateInitialShows()));
    localStorage.setItem(KEYS.SEAT_CATEGORIES, JSON.stringify(INITIAL_SEAT_CATEGORIES));
    localStorage.setItem(KEYS.COUPONS, JSON.stringify(INITIAL_COUPONS));
    localStorage.setItem(KEYS.PRICING, JSON.stringify(INITIAL_PRICING_CONFIG));
    localStorage.setItem(KEYS.POLICY, JSON.stringify(CANCELLATION_POLICY));
    localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    localStorage.setItem(KEYS.LOGS, JSON.stringify([]));
  },

  KEYS
};

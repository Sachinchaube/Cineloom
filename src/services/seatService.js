// Seat Layout, Pricing Tier & Concurrency Locking Service
import { storageService } from './storageService';
import { showService } from './showService';
import { loggerService } from './loggerService';

export const SeatStatus = {
  AVAILABLE: 'AVAILABLE',
  SELECTED: 'SELECTED',
  LOCKED: 'LOCKED',
  BOOKED: 'BOOKED',
  UNAVAILABLE: 'UNAVAILABLE'
};

export const seatService = {
  getSeatCategories() {
    return storageService.get(storageService.KEYS.SEAT_CATEGORIES) || [];
  },

  getPricingConfig() {
    return storageService.get(storageService.KEYS.PRICING) || {};
  },

  getCategoryForRow(rowLetter) {
    const categories = this.getSeatCategories();
    for (const cat of categories) {
      if (cat.rows.includes(rowLetter)) {
        return cat;
      }
    }
    return categories[0] || { name: 'Regular', basePrice: 12.0 };
  },

  generateSeatLayout(showId) {
    const show = showService.getShowById(showId);
    if (!show) {
      throw new Error('Show not found.');
    }

    this.cleanExpiredLocks(showId);

    const refreshedShow = showService.getShowById(showId);
    const bookedSet = new Set(refreshedShow.bookedSeats || []);
    const lockedMap = refreshedShow.lockedSeats || {};

    const rows = ['H', 'G', 'F', 'E', 'D', 'C', 'B', 'A']; // Top (VIP) to front (Regular)
    const colsCount = 10;
    const layout = [];

    rows.forEach(rowLetter => {
      const category = this.getCategoryForRow(rowLetter);
      const rowSeats = [];

      for (let col = 1; col <= colsCount; col++) {
        const seatNumber = `${rowLetter}${col}`;
        let status = SeatStatus.AVAILABLE;

        if (bookedSet.has(seatNumber)) {
          status = SeatStatus.BOOKED;
        } else if (lockedMap[seatNumber]) {
          status = SeatStatus.LOCKED;
        }

        rowSeats.push({
          seatNumber,
          row: rowLetter,
          column: col,
          categoryName: category.name,
          basePrice: category.basePrice,
          status,
          lockInfo: lockedMap[seatNumber] || null
        });
      }

      layout.push({
        row: rowLetter,
        category: category.name,
        basePrice: category.basePrice,
        seats: rowSeats
      });
    });

    return {
      showId: show.id,
      movieTitle: show.movieTitle,
      theatreName: show.theatreName,
      screenName: show.screenName,
      format: show.format,
      date: show.date,
      startTime: show.startTime,
      rows: layout
    };
  },

  cleanExpiredLocks(showId) {
    const shows = showService.getAllShows();
    const index = shows.findIndex(s => s.id === showId);
    if (index === -1) return;

    const show = shows[index];
    const locked = show.lockedSeats || {};
    const now = Date.now();
    let hasChanges = false;

    const updatedLocked = {};
    Object.entries(locked).forEach(([seat, info]) => {
      if (info && info.expiresAt > now) {
        updatedLocked[seat] = info;
      } else {
        hasChanges = true;
      }
    });

    if (hasChanges) {
      show.lockedSeats = updatedLocked;
      shows[index] = show;
      storageService.set(storageService.KEYS.SHOWS, shows);
      loggerService.info('EXPIRED_SEAT_LOCKS_CLEANED', { showId });
    }
  },

  lockSeats(showId, seatNumbers, userId, durationSeconds = 300) {
    if (!seatNumbers || !seatNumbers.length) {
      throw new Error('No seats specified for locking.');
    }

    const config = this.getPricingConfig();
    const maxLimit = config.maxSeatsPerBooking || 8;
    if (seatNumbers.length > maxLimit) {
      throw new Error(`You can select a maximum of ${maxLimit} seats per transaction.`);
    }

    this.cleanExpiredLocks(showId);

    const shows = showService.getAllShows();
    const index = shows.findIndex(s => s.id === showId);
    if (index === -1) {
      throw new Error('Show not found.');
    }

    const show = shows[index];
    const bookedSet = new Set(show.bookedSeats || []);
    const lockedMap = show.lockedSeats || {};

    // Validate that no seats are already booked or locked by another user
    for (const seat of seatNumbers) {
      if (bookedSet.has(seat)) {
        throw new Error(`Seat ${seat} is already booked.`);
      }
      if (lockedMap[seat] && lockedMap[seat].userId !== userId) {
        throw new Error(`Seat ${seat} is currently locked by another customer.`);
      }
    }

    const now = Date.now();
    const lockExpiry = now + durationSeconds * 1000;

    seatNumbers.forEach(seat => {
      lockedMap[seat] = {
        userId,
        lockedAt: now,
        expiresAt: lockExpiry
      };
    });

    show.lockedSeats = lockedMap;
    shows[index] = show;
    storageService.set(storageService.KEYS.SHOWS, shows);

    loggerService.info('SEATS_LOCKED', {
      showId,
      seats: seatNumbers,
      userId,
      expiresInSeconds: durationSeconds
    });

    return {
      success: true,
      lockedSeats: seatNumbers,
      expiresAt: lockExpiry
    };
  },

  releaseSeats(showId, seatNumbers, userId = null) {
    const shows = showService.getAllShows();
    const index = shows.findIndex(s => s.id === showId);
    if (index === -1) return;

    const show = shows[index];
    const lockedMap = show.lockedSeats || {};

    seatNumbers.forEach(seat => {
      if (lockedMap[seat]) {
        if (!userId || lockedMap[seat].userId === userId) {
          delete lockedMap[seat];
        }
      }
    });

    show.lockedSeats = lockedMap;
    shows[index] = show;
    storageService.set(storageService.KEYS.SHOWS, shows);

    loggerService.info('SEATS_RELEASED', { showId, seats: seatNumbers });
  }
};

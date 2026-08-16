// Show Scheduling & Conflict Validation Service
import { storageService } from './storageService';
import { movieService } from './movieService';
import { theatreService } from './theatreService';
import { loggerService } from './loggerService';

export const showService = {
  getAllShows() {
    return storageService.get(storageService.KEYS.SHOWS) || [];
  },

  getShowById(showId) {
    const shows = this.getAllShows();
    return shows.find(s => s.id === showId) || null;
  },

  getShows({ movieId, date, theatreId, city } = {}) {
    let shows = this.getAllShows();

    if (movieId) {
      shows = shows.filter(s => s.movieId === movieId);
    }

    if (date) {
      shows = shows.filter(s => s.date === date);
    }

    if (theatreId) {
      shows = shows.filter(s => s.theatreId === theatreId);
    }

    if (city) {
      const theatresInCity = theatreService.getTheatresByCity(city).map(t => t.id);
      shows = shows.filter(s => theatresInCity.includes(s.theatreId));
    }

    return shows.filter(s => s.isActive);
  },

  parseTimeToMinutes(timeStr) {
    // Expected format: "HH:MM AM/PM" or "HH:MM"
    if (!timeStr) return 0;
    const parts = timeStr.trim().split(' ');
    const timeParts = parts[0].split(':').map(Number);
    let hours = timeParts[0];
    const minutes = timeParts[1] || 0;

    if (parts.length > 1) {
      const modifier = parts[1].toUpperCase();
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
    }

    return hours * 60 + minutes;
  },

  formatMinutesToTime(totalMinutes) {
    const norm = (totalMinutes + 1440) % 1440;
    const hours = Math.floor(norm / 60);
    const mins = norm % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${String(displayHours).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${period}`;
  },

  checkScheduleConflict(screenId, date, startTimeStr, durationMinutes, excludeShowId = null) {
    const shows = this.getAllShows();
    const newStart = this.parseTimeToMinutes(startTimeStr);
    const newEnd = newStart + durationMinutes + 20; // 20 min interval buffer for cleaning/seating

    const screenShowsOnDate = shows.filter(
      s => s.screenId === screenId && s.date === date && s.isActive && s.id !== excludeShowId
    );

    for (const existing of screenShowsOnDate) {
      const exStart = this.parseTimeToMinutes(existing.startTime);
      const exEnd = this.parseTimeToMinutes(existing.endTime);

      // Check interval intersection: [newStart, newEnd] overlaps with [exStart, exEnd]
      const overlaps = (newStart < exEnd) && (newEnd > exStart);
      if (overlaps) {
        return {
          conflict: true,
          conflictingShow: existing,
          reason: `Schedule conflict: Screen already has '${existing.movieTitle}' playing from ${existing.startTime} to ${existing.endTime}.`
        };
      }
    }

    return { conflict: false };
  },

  createShow(showData) {
    const movie = movieService.getMovieById(showData.movieId);
    if (!movie) {
      throw new Error(`Movie not found.`);
    }

    if (movie.status !== 'NOW_SHOWING') {
      throw new Error(`Cannot schedule shows for movie with status '${movie.status}'. Only NOW_SHOWING movies can be scheduled.`);
    }

    const theatre = theatreService.getTheatreById(showData.theatreId);
    if (!theatre || !theatre.isActive) {
      throw new Error(`Theatre is inactive or not found.`);
    }

    const screen = theatre.screens.find(s => s.id === showData.screenId);
    if (!screen) {
      throw new Error(`Screen not found in selected theatre.`);
    }

    const duration = movie.durationMinutes || 130;
    const conflictCheck = this.checkScheduleConflict(
      showData.screenId,
      showData.date,
      showData.startTime,
      duration
    );

    if (conflictCheck.conflict) {
      throw new Error(conflictCheck.reason);
    }

    const startMins = this.parseTimeToMinutes(showData.startTime);
    const endTime = this.formatMinutesToTime(startMins + duration + 20);

    const shows = this.getAllShows();
    const newShow = {
      id: `shw-${Date.now()}`,
      movieId: movie.id,
      movieTitle: movie.title,
      theatreId: theatre.id,
      theatreName: theatre.name,
      screenId: screen.id,
      screenName: screen.name,
      format: showData.format || screen.format || '2D',
      date: showData.date,
      startTime: showData.startTime,
      endTime: endTime,
      basePrice: Number(showData.basePrice) || (screen.format.includes('IMAX') ? 380.0 : 250.0),
      isActive: true,
      bookedSeats: [],
      lockedSeats: {}
    };

    shows.push(newShow);
    storageService.set(storageService.KEYS.SHOWS, shows);

    loggerService.audit('SHOW_CREATED', {
      showId: newShow.id,
      movie: movie.title,
      screen: screen.name,
      date: newShow.date,
      time: newShow.startTime
    });

    return newShow;
  },

  deleteShow(showId) {
    const shows = this.getAllShows();
    const index = shows.findIndex(s => s.id === showId);
    if (index === -1) {
      throw new Error('Show not found.');
    }

    const target = shows[index];
    const filtered = shows.filter(s => s.id !== showId);
    storageService.set(storageService.KEYS.SHOWS, filtered);

    loggerService.audit('SHOW_DELETED', { showId, movie: target.movieTitle });
    return true;
  }
};

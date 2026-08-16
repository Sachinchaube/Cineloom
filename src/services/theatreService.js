// Theatre & Screen Management Service
import { storageService } from './storageService';
import { loggerService } from './loggerService';

export const theatreService = {
  getAllTheatres() {
    return storageService.get(storageService.KEYS.THEATRES) || [];
  },

  getTheatresByCity(city) {
    const theatres = this.getAllTheatres();
    if (!city || city === 'All Cities') return theatres;
    return theatres.filter(t => t.city.toLowerCase() === city.toLowerCase() && t.isActive);
  },

  getTheatreById(theatreId) {
    const theatres = this.getAllTheatres();
    return theatres.find(t => t.id === theatreId) || null;
  },

  addTheatre(theatreData) {
    if (!theatreData.name || !theatreData.city || !theatreData.location) {
      throw new Error('Theatre name, city, and location are required.');
    }

    const theatres = this.getAllTheatres();
    const newTheatre = {
      id: `th-${Date.now()}`,
      name: theatreData.name.trim(),
      city: theatreData.city.trim(),
      location: theatreData.location.trim(),
      facilities: theatreData.facilities || ['Dolby Atmos', 'Cafe Lounge', 'Recliner Seats'],
      rating: 4.8,
      isActive: true,
      screens: theatreData.screens && theatreData.screens.length ? theatreData.screens : [
        { id: `scr-${Date.now()}-1`, name: 'Screen 1 (Laser 4K)', format: 'Dolby Cinema', capacity: 56, type: 'Dolby' },
        { id: `scr-${Date.now()}-2`, name: 'Screen 2 (Standard)', format: '2D', capacity: 48, type: 'Standard' }
      ]
    };

    theatres.push(newTheatre);
    storageService.set(storageService.KEYS.THEATRES, theatres);

    loggerService.audit('THEATRE_ADDED', { theatreId: newTheatre.id, name: newTheatre.name });
    return newTheatre;
  },

  updateTheatre(theatreId, updates) {
    const theatres = this.getAllTheatres();
    const index = theatres.findIndex(t => t.id === theatreId);
    if (index === -1) {
      throw new Error(`Theatre with ID ${theatreId} not found.`);
    }

    theatres[index] = { ...theatres[index], ...updates };
    storageService.set(storageService.KEYS.THEATRES, theatres);

    loggerService.audit('THEATRE_UPDATED', { theatreId });
    return theatres[index];
  },

  addScreen(theatreId, screenData) {
    const theatres = this.getAllTheatres();
    const theatre = theatres.find(t => t.id === theatreId);
    if (!theatre) {
      throw new Error(`Theatre with ID ${theatreId} not found.`);
    }

    const newScreen = {
      id: `scr-${Date.now()}`,
      name: screenData.name || `Screen ${theatre.screens.length + 1}`,
      format: screenData.format || '2D',
      capacity: Number(screenData.capacity) || 56,
      type: screenData.type || 'Standard'
    };

    theatre.screens.push(newScreen);
    storageService.set(storageService.KEYS.THEATRES, theatres);

    loggerService.audit('SCREEN_ADDED', { theatreId, screenId: newScreen.id });
    return newScreen;
  }
};

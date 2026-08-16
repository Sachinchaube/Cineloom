// Movie Management & Search Service
import { storageService } from './storageService';
import { loggerService } from './loggerService';

export const movieService = {
  getAllMovies() {
    return storageService.get(storageService.KEYS.MOVIES) || [];
  },

  getMovieById(movieId) {
    const movies = this.getAllMovies();
    return movies.find(m => m.id === movieId) || null;
  },

  getMovies({
    searchQuery = '',
    genre = 'All Genres',
    language = 'All Languages',
    format = 'All Formats',
    status = 'ALL' // 'NOW_SHOWING' | 'UPCOMING' | 'ALL'
  } = {}) {
    let movies = this.getAllMovies();

    if (status && status !== 'ALL') {
      movies = movies.filter(m => m.status === status);
    }

    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      movies = movies.filter(
        m =>
          m.title.toLowerCase().includes(q) ||
          m.director.toLowerCase().includes(q) ||
          (m.cast && m.cast.some(c => c.toLowerCase().includes(q)))
      );
    }

    if (genre && genre !== 'All Genres') {
      movies = movies.filter(m => m.genre.toLowerCase() === genre.toLowerCase());
    }

    if (language && language !== 'All Languages') {
      movies = movies.filter(m => m.language.toLowerCase() === language.toLowerCase());
    }

    if (format && format !== 'All Formats') {
      movies = movies.filter(m => m.formats && m.formats.includes(format));
    }

    return movies;
  },

  addMovie(movieData) {
    if (!movieData.title || !movieData.genre || !movieData.language) {
      throw new Error('Title, genre, and language are mandatory fields.');
    }

    const movies = this.getAllMovies();
    const newMovie = {
      id: `mov-${Date.now()}`,
      title: movieData.title.trim(),
      genre: movieData.genre,
      language: movieData.language,
      formats: movieData.formats && movieData.formats.length ? movieData.formats : ['2D'],
      duration: movieData.duration || `${movieData.durationMinutes || 120} min`,
      durationMinutes: Number(movieData.durationMinutes) || 120,
      certification: movieData.certification || 'UA13+',
      rating: Number(movieData.rating) || 8.5,
      votes: movieData.votes || '1.0k',
      releaseDate: movieData.releaseDate || new Date().toISOString().split('T')[0],
      status: movieData.status || 'NOW_SHOWING',
      director: movieData.director || 'Unknown',
      cast: Array.isArray(movieData.cast) ? movieData.cast : (movieData.cast ? movieData.cast.split(',').map(s => s.trim()) : []),
      description: movieData.description || 'No synopsis provided.',
      bannerUrl: movieData.bannerUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80',
      posterUrl: movieData.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
      trailerUrl: movieData.trailerUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      featured: Boolean(movieData.featured)
    };

    movies.unshift(newMovie);
    storageService.set(storageService.KEYS.MOVIES, movies);

    loggerService.audit('MOVIE_ADDED', { movieId: newMovie.id, title: newMovie.title });
    return newMovie;
  },

  updateMovie(movieId, updates) {
    const movies = this.getAllMovies();
    const index = movies.findIndex(m => m.id === movieId);
    if (index === -1) {
      throw new Error(`Movie with ID ${movieId} not found.`);
    }

    if (updates.cast && typeof updates.cast === 'string') {
      updates.cast = updates.cast.split(',').map(s => s.trim());
    }

    const updated = { ...movies[index], ...updates };
    movies[index] = updated;
    storageService.set(storageService.KEYS.MOVIES, movies);

    loggerService.audit('MOVIE_UPDATED', { movieId, title: updated.title });
    return updated;
  },

  deleteMovie(movieId) {
    const movies = this.getAllMovies();
    const target = movies.find(m => m.id === movieId);
    if (!target) {
      throw new Error(`Movie with ID ${movieId} not found.`);
    }

    const filtered = movies.filter(m => m.id !== movieId);
    storageService.set(storageService.KEYS.MOVIES, filtered);

    loggerService.audit('MOVIE_DELETED', { movieId, title: target.title });
    return true;
  }
};

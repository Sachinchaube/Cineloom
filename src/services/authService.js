// Authentication & Authorization Service
import { storageService } from './storageService';
import { loggerService } from './loggerService';

export const UserRoles = {
  CUSTOMER: 'CUSTOMER',
  ADMINISTRATOR: 'ADMINISTRATOR'
};

export const authService = {
  getCurrentUser() {
    return storageService.get(storageService.KEYS.CURRENT_USER);
  },

  getAllUsers() {
    return storageService.get(storageService.KEYS.USERS) || [];
  },

  register({ name, email, password, phone, role = UserRoles.CUSTOMER, city = 'New York' }) {
    if (!name || !email || !password) {
      throw new Error('Name, email, and password are required.');
    }
    
    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      throw new Error('Please enter a valid email address.');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const users = this.getAllUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password, // In real backend this would be securely hashed with bcrypt
      phone: phone ? phone.trim() : '',
      role,
      city: city || 'New York',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    storageService.set(storageService.KEYS.USERS, users);
    
    // Auto-login registered user
    const sessionUser = { ...newUser };
    delete sessionUser.password;
    storageService.set(storageService.KEYS.CURRENT_USER, sessionUser);

    loggerService.audit('USER_REGISTERED', {
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role
    });

    return sessionUser;
  },

  login(email, password) {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    const users = this.getAllUsers();
    const user = users.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (!user) {
      loggerService.warn('LOGIN_FAILED', { email: email.trim().toLowerCase() });
      throw new Error('Invalid email or password. Please check your credentials.');
    }

    const sessionUser = { ...user };
    delete sessionUser.password;
    storageService.set(storageService.KEYS.CURRENT_USER, sessionUser);

    loggerService.info('USER_LOGGED_IN', {
      userId: user.id,
      email: user.email,
      role: user.role
    });

    return sessionUser;
  },

  logout() {
    const user = this.getCurrentUser();
    if (user) {
      loggerService.info('USER_LOGGED_OUT', { userId: user.id, email: user.email });
    }
    localStorage.removeItem(storageService.KEYS.CURRENT_USER);
  },

  updateProfile(userId, updates) {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) {
      throw new Error('User not found.');
    }

    const updatedUser = { ...users[index], ...updates };
    users[index] = updatedUser;
    storageService.set(storageService.KEYS.USERS, users);

    const sessionUser = { ...updatedUser };
    delete sessionUser.password;
    storageService.set(storageService.KEYS.CURRENT_USER, sessionUser);

    loggerService.info('PROFILE_UPDATED', { userId });
    return sessionUser;
  },

  isAdmin(user) {
    return user && user.role === UserRoles.ADMINISTRATOR;
  }
};

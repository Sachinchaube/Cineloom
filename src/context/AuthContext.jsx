import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, UserRoles } from '../services/authService';
import { storageService } from '../services/storageService';
import { useNotification } from './NotificationContext';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedCity, setSelectedCity] = useState('New York');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState('login'); // 'login' | 'register'
  const { showSuccess, showError, showInfo } = useNotification();

  useEffect(() => {
    storageService.initialize();
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      setCurrentUser(storedUser);
    }
    const city = storageService.get(storageService.KEYS.SELECTED_CITY);
    if (city) {
      setSelectedCity(city);
    }
  }, []);

  const changeCity = (city) => {
    setSelectedCity(city);
    storageService.set(storageService.KEYS.SELECTED_CITY, city);
    showInfo(`City switched to ${city}`);
  };

  const login = async (email, password) => {
    try {
      const user = authService.login(email, password);
      setCurrentUser(user);
      setAuthModalOpen(false);
      showSuccess(`Welcome back, ${user.name}!`);
      return user;
    } catch (err) {
      showError(err.message);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const user = authService.register(userData);
      setCurrentUser(user);
      setAuthModalOpen(false);
      showSuccess(`Account created successfully! Welcome, ${user.name}`);
      return user;
    } catch (err) {
      showError(err.message);
      throw err;
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    showInfo('Logged out successfully.');
  };

  const openLoginModal = (tab = 'login') => {
    setAuthInitialTab(tab);
    setAuthModalOpen(true);
  };

  const closeLoginModal = () => {
    setAuthModalOpen(false);
  };

  // Quick switch for testing demo roles
  const switchDemoUser = (role) => {
    const users = authService.getAllUsers();
    const target = users.find(u => u.role === role);
    if (target) {
      const sessionUser = { ...target };
      delete sessionUser.password;
      storageService.set(storageService.KEYS.CURRENT_USER, sessionUser);
      setCurrentUser(sessionUser);
      showSuccess(`Switched to demo ${role.toLowerCase()} account: ${target.name}`);
    }
  };

  const isAdmin = currentUser?.role === UserRoles.ADMINISTRATOR;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        selectedCity,
        changeCity,
        login,
        register,
        logout,
        authModalOpen,
        authInitialTab,
        openLoginModal,
        closeLoginModal,
        switchDemoUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

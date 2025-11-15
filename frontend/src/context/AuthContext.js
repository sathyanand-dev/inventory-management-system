import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const loadUser = useCallback(async () => {
    try {
      const data = await authAPI.getMe();
      // authAPI.getMe returns response.data which contains { success, user }
      setUser(data.user);
    } catch (error) {
      console.error('Error loading user:', error);
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token, loadUser]);

  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password);
      
      // authAPI.login returns response.data which contains { success, token, user }
      const { token: authToken, user: authUser } = data;
      
      if (!authToken || !authUser) {
        throw new Error('Invalid response from server');
      }
      
      localStorage.setItem('token', authToken);
      setToken(authToken);
      setUser(authUser);
      
      return data;
    } catch (error) {
      console.error('Login error in context:', error);
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      const data = await authAPI.register(username, email, password);
      
      // authAPI.register returns response.data which contains { success, token, user }
      const { token: authToken, user: authUser } = data;
      
      if (!authToken || !authUser) {
        throw new Error('Invalid response from server');
      }
      
      localStorage.setItem('token', authToken);
      setToken(authToken);
      setUser(authUser);
      
      return data;
    } catch (error) {
      console.error('Register error in context:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

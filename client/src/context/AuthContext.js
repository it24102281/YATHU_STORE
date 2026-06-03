import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = (process.env.REACT_APP_API_URL || '/api').replace(/\/+$/, '');

// Create context
const AuthContext = createContext();

// Initial state
const initialState = {
  token: localStorage.getItem('token'),
  admin: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      applyAuthToken(action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        admin: action.payload.admin,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'LOGIN_FAIL':
      return {
        ...state,
        token: state.token,
        admin: state.admin,
        isAuthenticated: state.isAuthenticated,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      applyAuthToken(null);
      return {
        ...state,
        token: null,
        admin: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    case 'LOAD_USER_SUCCESS':
      return {
        ...state,
        admin: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'LOAD_USER_FAIL':
      localStorage.removeItem('token');
      applyAuthToken(null);
      return {
        ...state,
        token: null,
        admin: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

// API setup
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const applyAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

applyAuthToken(localStorage.getItem('token'));

// Set auth token header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user
  const loadUser = async () => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        applyAuthToken(token);

        const res = await api.get('/admin/verify');

        dispatch({
          type: 'LOAD_USER_SUCCESS',
          payload: res.data?.data?.admin
        });
      } catch (err) {
        dispatch({
          type: 'LOAD_USER_FAIL',
          payload: 'Token is invalid or expired'
        });
      }
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Login admin
  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const res = await api.post('/admin/login', { email, password });
      const token = res.data?.data?.token;
      const admin = res.data?.data?.admin;

      if (!token || !admin) {
        throw new Error('Login response is missing token data');
      }

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token,
          admin
        }
      });

      return { success: true, data: res.data };
    } catch (err) {
      dispatch({
        type: 'LOGIN_FAIL',
        payload: err.response?.data?.message || 'Login failed'
      });

      return {
        success: false,
        message: err.response?.data?.message || 'Login failed'
      };
    }
  };

  // Logout
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Clear errors
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Check if user is admin
  const isAdmin = () => {
    return state.isAuthenticated && state.admin;
  };

  // Check if user is super admin
  const isSuperAdmin = () => {
    return state.isAuthenticated && state.admin?.role === 'super_admin';
  };

  // Get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, []);

  const value = {
    ...state,
    user: state.admin,
    login,
    logout,
    loadUser,
    clearError,
    isAdmin,
    isSuperAdmin,
    getAuthHeaders,
    api
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

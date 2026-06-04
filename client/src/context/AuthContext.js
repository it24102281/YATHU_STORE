import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = (process.env.REACT_APP_API_URL || '/api').replace(/\/+$/, '');

const AuthContext = createContext();

const getStoredAdminToken = () => localStorage.getItem('adminToken') || localStorage.getItem('token');
const getStoredUserToken = () => localStorage.getItem('userToken');

const initialState = {
  adminToken: getStoredAdminToken(),
  userToken: getStoredUserToken(),
  admin: null,
  customer: null,
  isAuthenticated: Boolean(getStoredAdminToken()),
  isUserAuthenticated: Boolean(getStoredUserToken()),
  adminLoading: true,
  userLoading: true,
  loading: true,
  error: null,
  userError: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'ADMIN_LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('adminToken', action.payload.token);
      return {
        ...state,
        adminToken: action.payload.token,
        admin: action.payload.admin,
        isAuthenticated: true,
        adminLoading: false,
        loading: false,
        error: null,
      };
    case 'ADMIN_LOGIN_FAIL':
      return {
        ...state,
        adminLoading: false,
        loading: state.userLoading,
        error: action.payload,
      };
    case 'ADMIN_LOAD_SUCCESS':
      return {
        ...state,
        admin: action.payload,
        isAuthenticated: true,
        adminLoading: false,
        loading: state.userLoading,
        error: null,
      };
    case 'ADMIN_LOAD_FAIL':
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      return {
        ...state,
        adminToken: null,
        admin: null,
        isAuthenticated: false,
        adminLoading: false,
        loading: state.userLoading,
        error: action.payload,
      };
    case 'ADMIN_LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      return {
        ...state,
        adminToken: null,
        admin: null,
        isAuthenticated: false,
        adminLoading: false,
        loading: state.userLoading,
        error: null,
      };
    case 'USER_LOGIN_SUCCESS':
      localStorage.setItem('userToken', action.payload.token);
      return {
        ...state,
        userToken: action.payload.token,
        customer: action.payload.user,
        isUserAuthenticated: true,
        userLoading: false,
        loading: state.adminLoading,
        userError: null,
      };
    case 'USER_LOGIN_FAIL':
      return {
        ...state,
        userLoading: false,
        loading: state.adminLoading,
        userError: action.payload,
      };
    case 'USER_LOAD_SUCCESS':
      return {
        ...state,
        customer: action.payload,
        isUserAuthenticated: true,
        userLoading: false,
        loading: state.adminLoading,
        userError: null,
      };
    case 'USER_LOAD_FAIL':
      localStorage.removeItem('userToken');
      return {
        ...state,
        userToken: null,
        customer: null,
        isUserAuthenticated: false,
        userLoading: false,
        loading: state.adminLoading,
        userError: action.payload,
      };
    case 'USER_LOGOUT':
      localStorage.removeItem('userToken');
      return {
        ...state,
        userToken: null,
        customer: null,
        isUserAuthenticated: false,
        userLoading: false,
        loading: state.adminLoading,
        userError: null,
      };
    case 'UPDATE_CUSTOMER':
      return {
        ...state,
        customer: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
        userError: null,
      };
    case 'SET_ADMIN_LOADING':
      return {
        ...state,
        adminLoading: action.payload,
        loading: action.payload || state.userLoading,
      };
    case 'SET_USER_LOADING':
      return {
        ...state,
        userLoading: action.payload,
        loading: state.adminLoading || action.payload,
      };
    default:
      return state;
  }
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (!config.headers.Authorization) {
      const adminToken = getStoredAdminToken();
      const userToken = getStoredUserToken();
      const fallbackToken = adminToken || userToken;

      if (fallbackToken) {
        config.headers.Authorization = `Bearer ${fallbackToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

const withAdminHeaders = () => {
  const token = getStoredAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const withUserHeaders = () => {
  const token = getStoredUserToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const loadAdmin = async () => {
    const token = getStoredAdminToken();

    if (!token) {
      dispatch({ type: 'SET_ADMIN_LOADING', payload: false });
      return;
    }

    try {
      dispatch({ type: 'SET_ADMIN_LOADING', payload: true });
      const res = await api.get('/admin/verify', { headers: withAdminHeaders() });
      dispatch({
        type: 'ADMIN_LOAD_SUCCESS',
        payload: res.data?.data?.admin,
      });
    } catch (err) {
      dispatch({
        type: 'ADMIN_LOAD_FAIL',
        payload: 'Token is invalid or expired',
      });
    }
  };

  const loadCustomer = async () => {
    const token = getStoredUserToken();

    if (!token) {
      dispatch({ type: 'SET_USER_LOADING', payload: false });
      return;
    }

    try {
      dispatch({ type: 'SET_USER_LOADING', payload: true });
      const res = await api.get('/user/profile', { headers: withUserHeaders() });
      dispatch({
        type: 'USER_LOAD_SUCCESS',
        payload: res.data?.data,
      });
    } catch (err) {
      dispatch({
        type: 'USER_LOAD_FAIL',
        payload: 'User session is invalid or expired',
      });
    }
  };

  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_ADMIN_LOADING', payload: true });
      const res = await api.post('/admin/login', { email, password });
      const token = res.data?.data?.token;
      const admin = res.data?.data?.admin;

      if (!token || !admin) {
        throw new Error('Login response is missing admin data');
      }

      dispatch({
        type: 'ADMIN_LOGIN_SUCCESS',
        payload: { token, admin },
      });

      return { success: true, data: res.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      dispatch({
        type: 'ADMIN_LOGIN_FAIL',
        payload: message,
      });
      return { success: false, message };
    }
  };

  const userLogin = async (identifier, password) => {
    try {
      dispatch({ type: 'SET_USER_LOADING', payload: true });
      const res = await api.post('/auth/user/login', { identifier, password });
      const token = res.data?.data?.token;
      const user = res.data?.data?.user;

      dispatch({
        type: 'USER_LOGIN_SUCCESS',
        payload: { token, user },
      });

      return { success: true, message: res.data?.message || 'Login successful', data: user };
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid login details';
      dispatch({
        type: 'USER_LOGIN_FAIL',
        payload: message,
      });
      return { success: false, message };
    }
  };

  const userSignup = async (payload) => {
    const res = await api.post('/auth/user/signup', payload);
    return res.data;
  };

  const verifyUserSignup = async (payload) => {
    const res = await api.post('/auth/user/verify-signup', payload);
    return res.data;
  };

  const resendSignupCode = async (email) => {
    const res = await api.post('/auth/user/resend-signup-code', { email });
    return res.data;
  };

  const forgotPassword = async (email) => {
    const res = await api.post('/auth/user/forgot-password', { email });
    return res.data;
  };

  const resetPassword = async (payload) => {
    const res = await api.post('/auth/user/reset-password', payload);
    return res.data;
  };

  const logout = () => {
    dispatch({ type: 'ADMIN_LOGOUT' });
  };

  const userLogout = async () => {
    try {
      if (getStoredUserToken()) {
        await api.post('/auth/user/logout', {}, { headers: withUserHeaders() });
      }
    } catch (error) {
      // Keep UX smooth even if the backend session logout request fails.
    } finally {
      dispatch({ type: 'USER_LOGOUT' });
    }
  };

  const updateUserProfile = async (payload) => {
    const res = await api.put('/user/profile', payload, { headers: withUserHeaders() });
    dispatch({ type: 'UPDATE_CUSTOMER', payload: res.data?.data });
    return res.data;
  };

  const changeUserPassword = async (payload) => {
    const res = await api.put('/user/change-password', payload, { headers: withUserHeaders() });
    return res.data;
  };

  const getUserOrders = async () => {
    const res = await api.get('/user/orders', { headers: withUserHeaders() });
    return res.data;
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const isAdmin = () => state.isAuthenticated && Boolean(state.admin);
  const isSuperAdmin = () => state.isAuthenticated && state.admin?.role === 'super_admin';

  useEffect(() => {
    loadAdmin();
    loadCustomer();
  }, []);

  const value = {
    ...state,
    user: state.admin,
    login,
    adminLogin: login,
    logout,
    loadUser: loadAdmin,
    loadAdmin,
    loadCustomer,
    clearError,
    isAdmin,
    isSuperAdmin,
    getAuthHeaders: withAdminHeaders,
    getUserAuthHeaders: withUserHeaders,
    userLogin,
    userSignup,
    verifyUserSignup,
    resendSignupCode,
    userLogout,
    forgotPassword,
    resetPassword,
    updateUserProfile,
    changeUserPassword,
    getUserOrders,
    api,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

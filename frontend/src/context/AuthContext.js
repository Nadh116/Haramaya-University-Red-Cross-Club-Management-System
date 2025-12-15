import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../services/api';

// Initial state
const initialState = {
    user: null,
    token: localStorage.getItem('token'),
    loading: true,
    error: null
};

// Action types
const AUTH_ACTIONS = {
    LOGIN_START: 'LOGIN_START',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    LOGOUT: 'LOGOUT',
    REGISTER_START: 'REGISTER_START',
    REGISTER_SUCCESS: 'REGISTER_SUCCESS',
    REGISTER_FAILURE: 'REGISTER_FAILURE',
    LOAD_USER_START: 'LOAD_USER_START',
    LOAD_USER_SUCCESS: 'LOAD_USER_SUCCESS',
    LOAD_USER_FAILURE: 'LOAD_USER_FAILURE',
    UPDATE_USER: 'UPDATE_USER',
    CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
const authReducer = (state, action) => {
    switch (action.type) {
        case AUTH_ACTIONS.LOGIN_START:
        case AUTH_ACTIONS.REGISTER_START:
        case AUTH_ACTIONS.LOAD_USER_START:
            return {
                ...state,
                loading: true,
                error: null
            };

        case AUTH_ACTIONS.LOGIN_SUCCESS:
        case AUTH_ACTIONS.REGISTER_SUCCESS:
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                loading: false,
                error: null
            };

        case AUTH_ACTIONS.LOAD_USER_SUCCESS:
        case AUTH_ACTIONS.UPDATE_USER:
            return {
                ...state,
                user: action.payload,
                loading: false,
                error: null
            };

        case AUTH_ACTIONS.LOGIN_FAILURE:
        case AUTH_ACTIONS.REGISTER_FAILURE:
        case AUTH_ACTIONS.LOAD_USER_FAILURE:
            localStorage.removeItem('token');
            return {
                ...state,
                user: null,
                token: null,
                loading: false,
                error: action.payload
            };

        case AUTH_ACTIONS.LOGOUT:
            localStorage.removeItem('token');
            return {
                ...state,
                user: null,
                token: null,
                loading: false,
                error: null
            };

        case AUTH_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null
            };

        default:
            return state;
    }
};

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Load user on app start
    useEffect(() => {
        if (state.token) {
            loadUser();
        } else {
            dispatch({ type: AUTH_ACTIONS.LOAD_USER_FAILURE, payload: null });
        }
    }, []);

    // Load user from token
    const loadUser = async () => {
        dispatch({ type: AUTH_ACTIONS.LOAD_USER_START });

        try {
            const response = await api.get('/auth/me');
            dispatch({
                type: AUTH_ACTIONS.LOAD_USER_SUCCESS,
                payload: response.data.user
            });
        } catch (error) {
            dispatch({
                type: AUTH_ACTIONS.LOAD_USER_FAILURE,
                payload: error.response?.data?.message || 'Failed to load user'
            });
        }
    };

    // Login
    const login = async (email, password) => {
        dispatch({ type: AUTH_ACTIONS.LOGIN_START });

        try {
            const response = await api.post('/auth/login', { email, password });
            dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: response.data
            });
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            dispatch({
                type: AUTH_ACTIONS.LOGIN_FAILURE,
                payload: message
            });
            return { success: false, error: message };
        }
    };

    // Register
    const register = async (userData) => {
        dispatch({ type: AUTH_ACTIONS.REGISTER_START });

        try {
            const response = await api.post('/auth/register', userData);
            dispatch({
                type: AUTH_ACTIONS.REGISTER_SUCCESS,
                payload: response.data
            });
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            dispatch({
                type: AUTH_ACTIONS.REGISTER_FAILURE,
                payload: message
            });
            return { success: false, error: message };
        }
    };

    // Logout
    const logout = () => {
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
    };

    // Update user
    const updateUser = async (userData) => {
        try {
            const response = await api.put('/auth/updatedetails', userData);
            dispatch({
                type: AUTH_ACTIONS.UPDATE_USER,
                payload: response.data.user
            });
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Update failed';
            return { success: false, error: message };
        }
    };

    // Update password
    const updatePassword = async (currentPassword, newPassword) => {
        try {
            const response = await api.put('/auth/updatepassword', {
                currentPassword,
                newPassword
            });
            dispatch({
                type: AUTH_ACTIONS.UPDATE_USER,
                payload: response.data.user
            });
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Password update failed';
            return { success: false, error: message };
        }
    };

    // Clear error
    const clearError = () => {
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
    };

    // Check if user has required role
    const hasRole = (roles) => {
        if (!state.user) return false;
        if (Array.isArray(roles)) {
            return roles.includes(state.user.role);
        }
        return state.user.role === roles;
    };

    // Check if user is approved
    const isApproved = () => {
        if (!state.user) return false;
        if (['admin', 'officer'].includes(state.user.role)) return true;
        return state.user.isApproved;
    };

    const value = {
        ...state,
        login,
        register,
        logout,
        updateUser,
        updatePassword,
        clearError,
        hasRole,
        isApproved,
        loadUser
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
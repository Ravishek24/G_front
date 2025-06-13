// auth.js - Enhanced with automatic logout and redirect
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Use the full API URL
const BASE_URL = "https://strike.atsproduct.in";

// Helper function to store token
const storeToken = (token) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem("token", token);
  }
};

// Helper function to clear all auth data
export const clearAuthData = () => {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }
};

// Helper function to redirect to login
export const redirectToLogin = () => {
  clearAuthData();
  // Use window.location for immediate redirect
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

// Global axios interceptor for handling auth errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors globally
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('Authentication failed - redirecting to login');
      redirectToLogin();
      return Promise.reject(new Error('Authentication failed. Please login again.'));
    }
    return Promise.reject(error);
  }
);

// Register user API (Redux Thunk)
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/users/signup`, userData, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        withCredentials: false,
      });
      
      // Store token if provided
      if (response.data?.token) {
        storeToken(response.data.token);
      } else if (response.data?.data?.token) {
        storeToken(response.data.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.log("Register API Error:", error.response?.data || error.message);
      
      // Handle auth errors
      if (error.response?.status === 401 || error.response?.status === 403) {
        redirectToLogin();
        return rejectWithValue("Authentication failed. Please login again.");
      }
      
      let errorMessage = "Registration failed";
      
      if (error.response?.data?.errors) {
        if (Array.isArray(error.response.data.errors)) {
          errorMessage = error.response.data.errors.map((err) => err.msg).join(", ");
        } else {
          errorMessage = error.response.data.errors.msg || errorMessage;
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

// Login user API (Redux Thunk)
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      console.log("Making login request to:", `${BASE_URL}/api/users/login`);
      console.log("Request data:", userData);
      
      const response = await axios.post(`${BASE_URL}/api/users/login`, userData, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: false
      });
      
      console.log("Login response:", response.data);
      
      // Handle your API response structure: {success: true, data: {user: {...}, tokens: {accessToken, refreshToken}}}
      let token = null;
      let refreshToken = null;
      
      if (response.data?.success && response.data?.data?.tokens) {
        const tokens = response.data.data.tokens;
        token = tokens.accessToken;
        refreshToken = tokens.refreshToken;
        
        console.log("Access token found:", token);
        console.log("Refresh token found:", refreshToken);
      }
      
      // Store the access token
      if (token) {
        storeToken(token);
        console.log("Token stored successfully");
        
        // Optionally store refresh token as well
        if (refreshToken && typeof localStorage !== 'undefined') {
          localStorage.setItem("refreshToken", refreshToken);
          console.log("Refresh token stored");
        }
      } else {
        console.warn("No access token found in response");
      }
      
      return response.data;
    } catch (error) {
      console.log("Login API Error:", error.response?.data || error.message);
      
      let errorMessage = "Login failed";
      
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        errorMessage = "Network error. Please check your internet connection and try again.";
      } else if (error.response?.status === 401) {
        errorMessage = "Invalid credentials. Please check your phone number/email and password.";
      } else if (error.response?.status === 403) {
        errorMessage = "Access forbidden. Please contact support.";
        redirectToLogin();
      } else if (error.response?.data?.errors) {
        if (Array.isArray(error.response.data.errors)) {
          errorMessage = error.response.data.errors.map((err) => err.msg).join(", ");
        } else {
          errorMessage = error.response.data.errors.msg || errorMessage;
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message === "timeout exceeded" || error.code === "ECONNABORTED") {
        errorMessage = "Request timed out. Please check your network and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

// Enhanced function to check if user is authenticated
export const isAuthenticated = () => {
  try {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    
    const token = localStorage.getItem("token");
    
    if (!token) {
      return false;
    }
    
    // Optional: Add token expiry check here if your tokens have expiry info
    // You can decode JWT and check exp field
    
    return true;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

// Enhanced logout function
export const logout = () => {
  clearAuthData();
  
  // Redirect to login page
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

// Function to check token validity (call this before making API requests)
export const validateToken = async () => {
  try {
    if (!isAuthenticated()) {
      redirectToLogin();
      return false;
    }
    
    // Optional: Make a lightweight API call to validate token
    // const response = await axios.get(`${BASE_URL}/api/auth/validate`);
    // return response.status === 200;
    
    return true;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      redirectToLogin();
      return false;
    }
    return false;
  }
};
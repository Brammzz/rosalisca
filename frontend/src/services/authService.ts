import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

export interface AuthResponse {
  _id: string;
  email: string;
  role: string;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

export interface AuthResponse {
  _id: string;
  email: string;
  role: string;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export const loginAPI = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    console.log('Attempting login to:', `${API_URL}/login`);
    console.log('API_URL environment:', import.meta.env.VITE_API_URL);
    
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    console.log('Login response status:', response.status);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Login endpoint not found. Please check if environment variables are configured properly. API URL: ${API_URL}/login`);
      }
      
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      throw new Error(errorData.message || `Login failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('Login successful');
    return data;
    
  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Network error: Cannot connect to ${API_URL}/login. Please check if the backend is running and environment variables are set correctly.`);
    }
    
    throw error;
  }
};

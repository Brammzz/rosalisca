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

export const loginAPI = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }

  return response.json();
};

import { AuthResponse, ApiError, User } from '../types';
import { API_CONFIG } from '../config/api';

const BASE_URL = API_CONFIG.BASE_URL;

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    return response;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error.message);
    }

    return response.json();
  }

  async sendVerification(email: string): Promise<{ message: string; token?: string }> {
    const response = await this.request('/auth/send_verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error.message);
    }

    return response.json();
  }

  async verifyEmail(email: string, verificationToken: string): Promise<{ message: string; verified: boolean }> {
    const response = await this.request('/auth/verify_email', {
      method: 'POST',
      body: JSON.stringify({ email, verification_token: verificationToken }),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error.message);
    }

    return response.json();
  }

  async register(name: string, email: string, password: string, verificationToken: string): Promise<AuthResponse> {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, verification_token: verificationToken }),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error.message);
    }

    return response.json();
  }

  async googleSignIn(idToken: string): Promise<AuthResponse> {
    const response = await this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ id_token: idToken }),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error.message);
    }

    return response.json();
  }

  async passwordReset(email: string): Promise<{ message: string; token?: string }> {
    const response = await this.request('/auth/password/reset', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error.message);
    }

    return response.json();
  }

  async passwordConfirm(
    email: string,
    token: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const response = await this.request('/auth/password/confirm', {
      method: 'POST',
      body: JSON.stringify({ email, token, new_password: newPassword }),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error.message);
    }

    return response.json();
  }

  async linkPassword(password: string): Promise<{ message: string }> {
    const response = await this.request('/auth/link_password', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error.message);
    }

    return response.json();
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.request('/me');

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error.message);
    }

    return response.json();
  }
}

export const apiService = new ApiService();

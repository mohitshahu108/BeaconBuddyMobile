import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { apiService } from '../services/api';
import { User, AuthResponse } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  googleSignIn: () => Promise<void>;
  logout: () => Promise<void>;
  passwordReset: (email: string) => Promise<{ message: string; token?: string }>;
  passwordConfirm: (
    email: string,
    token: string,
    newPassword: string
  ) => Promise<{ message: string }>;
  linkPassword: (password: string) => Promise<{ message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = '@beaconbuddy_token';
const USER_KEY = '@beaconbuddy_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
    configureGoogleSignIn();
  }, []);

  const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId: '803278777588-7aicjs72fo7q51n6hs1eo12ntec3rgov.apps.googleusercontent.com',
      offlineAccess: false,
    });
  };

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
      const storedUser = await AsyncStorage.getItem(USER_KEY);

      if (storedToken && storedUser) {
        setToken(storedToken);
        apiService.setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to load stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const storeAuth = async (authToken: string, userData: User) => {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, authToken);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to store auth:', error);
    }
  };

  const clearStoredAuth = async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Failed to clear stored auth:', error);
    }
  };

  const login = async (email: string, password: string) => {
    const response: AuthResponse = await apiService.login(email, password);
    setToken(response.token);
    setUser(response.user);
    apiService.setToken(response.token);
    await storeAuth(response.token, response.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const response: AuthResponse = await apiService.register(name, email, password);
    setToken(response.token);
    setUser(response.user);
    apiService.setToken(response.token);
    await storeAuth(response.token, response.user);
  };

  const googleSignIn = async () => {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const idToken = userInfo?.data?.idToken;

    if (!idToken) {
      throw new Error('Failed to get Google ID token');
    }

    const response: AuthResponse = await apiService.googleSignIn(idToken);
    setToken(response.token);
    setUser(response.user);
    apiService.setToken(response.token);
    await storeAuth(response.token, response.user);
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    apiService.clearToken();
    await clearStoredAuth();
    await GoogleSignin.signOut();
  };

  const passwordReset = async (email: string) => {
    return await apiService.passwordReset(email);
  };

  const passwordConfirm = async (
    email: string,
    token: string,
    newPassword: string
  ) => {
    return await apiService.passwordConfirm(email, token, newPassword);
  };

  const linkPassword = async (password: string) => {
    return await apiService.linkPassword(password);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        googleSignIn,
        logout,
        passwordReset,
        passwordConfirm,
        linkPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Component tests for LoginScreen — Guest Mode entry point
 * Story 1.2 — Guest Mode Mobile Entry Point (AC: 1)
 */

import React from 'react';
import { act, render, screen, fireEvent } from '@testing-library/react-native';
import LoginScreen from '../components/screens/LoginScreen';

// Mock AuthContext
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(),
    googleSignIn: jest.fn(),
    user: null,
    isLoading: false,
  }),
}));

const { mockNavigate } = require('@react-navigation/native');

describe('LoginScreen — Browse as Guest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the "Browse as Guest" button', async () => {
    await act(async () => {
      render(<LoginScreen />);
    });
    expect(screen.getByText('Browse as Guest')).toBeTruthy();
  });

  it('navigates to GuestFeed when "Browse as Guest" is pressed', async () => {
    await act(async () => {
      render(<LoginScreen />);
    });
    fireEvent.press(screen.getByText('Browse as Guest'));
    expect(mockNavigate).toHaveBeenCalledWith('GuestFeed');
  });
});

import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import HomeScreen from '../components/screens/HomeScreen';

jest.mock('../services/api', () => ({
  apiService: {
    getBeacons: jest.fn(),
  },
}));

jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const { mockNavigate } = require('@react-navigation/native');
const mockGetBeacons = apiService.getBeacons as jest.Mock;
const mockUseAuth = useAuth as jest.Mock;
const mockLogout = jest.fn();

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetBeacons.mockResolvedValue([]);
    mockUseAuth.mockReturnValue({
      user: { id: 7, name: 'Asha', email: 'asha@example.com' },
      logout: mockLogout,
    });
  });

  it('loads the shared feed and preserves account, logout, and link-password actions', async () => {
    await act(async () => {
      render(<HomeScreen />);
      await Promise.resolve();
      await Promise.allSettled([mockGetBeacons.mock.results[0]?.value]);
    });

    expect(mockGetBeacons).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Welcome back!')).toBeTruthy();
    expect(screen.getByText('Asha')).toBeTruthy();
    expect(screen.getByText('asha@example.com')).toBeTruthy();
    expect(screen.getByText('No Beacons nearby')).toBeTruthy();

    await act(async () => {
      fireEvent.press(screen.getByText('Link Password'));
    });
    expect(mockNavigate).toHaveBeenCalledWith('LinkPassword');

    await act(async () => {
      fireEvent.press(screen.getByText('Logout'));
    });
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});

/**
 * Component tests for BeaconFeedScreen (Guest Mode)
 * Story 1.2 — Guest Mode Mobile Entry Point (AC: 2, 3, 4)
 */

import React from 'react';
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import BeaconFeedScreen from '../components/screens/BeaconFeedScreen';

jest.spyOn(Alert, 'alert');

const { mockNavigate } = require('@react-navigation/native');

describe('BeaconFeedScreen — Guest Mode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the guest banner with correct message', async () => {
    await act(async () => { render(<BeaconFeedScreen />); });
    expect(
      screen.getByText("You're browsing as a guest. Sign in to join activities."),
    ).toBeTruthy();
  });

  it('renders a Sign In link in the guest banner', async () => {
    await act(async () => { render(<BeaconFeedScreen />); });
    const signInLinks = screen.getAllByText('Sign In');
    expect(signInLinks.length).toBeGreaterThan(0);
  });

  it('navigates to Login when banner Sign In link is pressed', async () => {
    await act(async () => { render(<BeaconFeedScreen />); });
    const signInLinks = screen.getAllByText('Sign In');
    fireEvent.press(signInLinks[0]);
    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });

  it('renders the empty state with "No Beacons yet" message', async () => {
    await act(async () => { render(<BeaconFeedScreen />); });
    expect(screen.getByText('No Beacons yet')).toBeTruthy();
    expect(
      screen.getByText('Be the first to post an activity in your area.'),
    ).toBeTruthy();
  });

  it('shows auth required alert when "Sign in to Post" is pressed', async () => {
    await act(async () => { render(<BeaconFeedScreen />); });
    fireEvent.press(screen.getByText('Sign in to Post'));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Sign In Required',
        'You need an account to join activities.',
        expect.any(Array),
      );
    });
  });

  it('auth alert Sign In button navigates to Login', async () => {
    await act(async () => { render(<BeaconFeedScreen />); });
    fireEvent.press(screen.getByText('Sign in to Post'));
    await waitFor(() => {
      const [, , buttons] = (Alert.alert as jest.Mock).mock.calls[0];
      const signInBtn = buttons.find((b: any) => b.text === 'Sign In');
      signInBtn.onPress();
      expect(mockNavigate).toHaveBeenCalledWith('Login');
    });
  });
});

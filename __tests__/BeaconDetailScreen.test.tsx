import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';
import BeaconDetailScreen from '../components/screens/BeaconDetailScreen';

jest.spyOn(Alert, 'alert');

const { mockGoBack, mockNavigation } = require('@react-navigation/native');

const beacon = {
  id: 1,
  title: 'Cricket meetup',
  description: 'Casual cricket',
  category: 'sports' as const,
  beacon_type: 'two_person' as const,
  join_policy: 'open' as const,
  event_time: '2026-10-01T10:00:00Z',
  creator: { id: 7, name: 'Asha', reliability_score: 700 },
  joined_count: 1,
  max_participants: 4,
};

describe('BeaconDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows the selected Beacon and gates guest join', async () => {
    await act(async () => {
      render(<BeaconDetailScreen route={{ params: { beacon, guestMode: true } }} />);
    });

    expect(screen.getByText('Cricket meetup')).toBeTruthy();
    expect(screen.getByText('Casual cricket')).toBeTruthy();
    expect(screen.getByText('1 of 4 joined')).toBeTruthy();

    await act(async () => {
      fireEvent.press(screen.getByText('Join'));
    });
    expect(Alert.alert).toHaveBeenCalledWith(
      'Sign In Required',
      'You need an account to join activities.',
      expect.any(Array),
    );
  });

  it('returns to the feed when the user closes details', async () => {
    await act(async () => {
      render(<BeaconDetailScreen route={{ params: { beacon, guestMode: false } }} />);
    });
    await act(async () => {
      fireEvent.press(screen.getByText('Back to feed'));
    });
    expect(mockGoBack).toHaveBeenCalledTimes(1);
    expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
  });
});

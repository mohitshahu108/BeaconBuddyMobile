import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { apiService } from '../services/api';
import BeaconFeedScreen from '../components/screens/BeaconFeedScreen';

jest.mock('../services/api', () => ({
  apiService: {
    getBeacons: jest.fn(),
  },
}));

jest.spyOn(Alert, 'alert');

const { mockNavigate } = require('@react-navigation/native');
const mockGetBeacons = apiService.getBeacons as jest.Mock;

const beacon = {
  id: 1,
  title: 'Cricket meetup',
  description: 'Casual cricket',
  category: 'sports',
  beacon_type: 'two_person',
  join_policy: 'open',
  event_time: '2026-10-01T10:00:00Z',
  creator: { id: 7, name: 'Asha', reliability_score: 700 },
  joined_count: 1,
  max_participants: 4,
};

const settleLatestRequest = async () => {
  const request = mockGetBeacons.mock.results.at(-1)?.value;
  if (request) {
    await Promise.allSettled([request]);
  }
};

const renderAndLoad = async () => {
  await act(async () => {
    render(<BeaconFeedScreen />);
    await Promise.resolve();
    await settleLatestRequest();
  });
};

describe('BeaconFeedScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetBeacons.mockResolvedValue([beacon]);
  });

  it('loads and renders the live feed with its public summary fields', async () => {
    await renderAndLoad();

    expect(mockGetBeacons).toHaveBeenCalledTimes(1);
    expect(
      screen.getByText("You're browsing as a guest. Sign in to join activities."),
    ).toBeTruthy();
    expect(screen.getByText('Cricket meetup')).toBeTruthy();
    expect(screen.getByText('Asha')).toBeTruthy();
    expect(screen.getByText('Reliability 700')).toBeTruthy();
    expect(screen.getByText('Sports')).toBeTruthy();
    expect(
      screen.getByText(new Date(beacon.event_time).toLocaleString()),
    ).toBeTruthy();
    expect(screen.getByText('Open')).toBeTruthy();
  });

  it('shows a loading indicator while the initial request is pending', async () => {
    let resolveRequest!: (value: typeof beacon[]) => void;
    mockGetBeacons.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      }),
    );

    await act(async () => {
      render(<BeaconFeedScreen />);
    });

    expect(screen.getByTestId('feed-loading')).toBeTruthy();
    await act(async () => {
      resolveRequest([]);
      await settleLatestRequest();
    });
    expect(screen.getByText('No Beacons nearby')).toBeTruthy();
  });

  it('shows the empty state for a successful empty response', async () => {
    mockGetBeacons.mockResolvedValue([]);

    await renderAndLoad();

    expect(screen.getByText('No Beacons nearby')).toBeTruthy();
    expect(screen.queryByText('Cricket meetup')).toBeNull();
  });

  it('shows an error and retries a failed initial request', async () => {
    mockGetBeacons
      .mockRejectedValueOnce(new Error('Network unavailable'))
      .mockResolvedValueOnce([beacon]);

    await renderAndLoad();

    expect(screen.getByText('Network unavailable')).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByText('Retry'));
      await settleLatestRequest();
    });

    expect(screen.getByText('Cricket meetup')).toBeTruthy();
    expect(mockGetBeacons).toHaveBeenCalledTimes(2);
  });

  it('supports pull-to-refresh and keeps current items on refresh failure', async () => {
    mockGetBeacons
      .mockResolvedValueOnce([beacon])
      .mockRejectedValueOnce(new Error('Refresh failed'));

    await renderAndLoad();

    await act(async () => {
      fireEvent(screen.getByTestId('beacon-feed-list'), 'refresh');
      await settleLatestRequest();
    });

    expect(mockGetBeacons).toHaveBeenCalledTimes(2);
    expect(screen.getByText('Cricket meetup')).toBeTruthy();
    expect(screen.getByText('Refresh failed')).toBeTruthy();
  });

  it('requires sign-in for guest create and opens the selected Beacon details', async () => {
    await renderAndLoad();

    await act(async () => {
      fireEvent.press(screen.getByText('Create Beacon'));
    });
    expect(Alert.alert).toHaveBeenCalledWith(
      'Sign In Required',
      'You need an account to join activities.',
      expect.any(Array),
    );

    await act(async () => {
      fireEvent.press(
        screen.getByRole('button', { name: 'View Cricket meetup details' }),
      );
    });
    expect(mockNavigate).toHaveBeenCalledWith('BeaconDetail', {
      beacon,
      guestMode: true,
    });
    expect(Alert.alert).toHaveBeenCalledTimes(1);
  });

  it('navigates to Login from the guest sign-in prompt', async () => {
    await renderAndLoad();

    await act(async () => {
      fireEvent.press(screen.getByText('Sign In'));
    });
    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });

  it('uses a neutral fallback when a creator name is absent', async () => {
    mockGetBeacons.mockResolvedValue([
      { ...beacon, creator: { id: 8, name: null, reliability_score: 700 } },
    ]);

    await renderAndLoad();

    expect(screen.getByText('Beacon creator')).toBeTruthy();
  });
});

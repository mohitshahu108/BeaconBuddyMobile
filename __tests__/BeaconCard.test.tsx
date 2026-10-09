import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import BeaconCard from '../components/BeaconCard';

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

describe('BeaconCard', () => {
  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(new Date('2026-09-29T00:00:00Z').getTime());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('shows key Beacon details and a relative and absolute event time', async () => {
    await act(async () => {
      render(<BeaconCard beacon={beacon} onPress={jest.fn()} />);
    });

    expect(screen.getByText('Cricket meetup')).toBeTruthy();
    expect(screen.getByText('In 2 days')).toBeTruthy();
    expect(
      screen.getByText(new Date(beacon.event_time).toLocaleString()),
    ).toBeTruthy();
    expect(screen.getByText('Asha')).toBeTruthy();
    expect(screen.getByText('Reliability 700')).toBeTruthy();
    expect(screen.getByText('Open')).toBeTruthy();
    expect(screen.getByText('1 of 4 joined')).toBeTruthy();
  });

  it('uses a neutral creator fallback and opens when pressed', async () => {
    const onPress = jest.fn();
    await act(async () => {
      render(
        <BeaconCard
          beacon={{
            ...beacon,
            creator: { id: 7, name: null, reliability_score: 700 },
          }}
          onPress={onPress}
        />,
      );
    });

    expect(screen.getByText('Beacon creator')).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByRole('button', { name: 'View Cricket meetup details' }));
    });
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

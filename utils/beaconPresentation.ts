import { BeaconCategory, BeaconJoinPolicy } from '../types';

export const CATEGORY_LABELS: Record<BeaconCategory, string> = {
  movie: 'Movie',
  sports: 'Sports',
  park: 'Park',
  food: 'Food',
  other: 'Other',
};

export const JOIN_POLICY_LABELS: Record<BeaconJoinPolicy, string> = {
  open: 'Open',
  personal: 'Personal',
  filtered: 'Filtered',
};

export const formatRelativeTime = (eventTime: string) => {
  const difference = new Date(eventTime).getTime() - Date.now();
  if (!Number.isFinite(difference)) {
    return 'Time unavailable';
  }

  const minutes = Math.max(1, Math.round(difference / 60_000));
  if (minutes < 60) {
    return `In ${minutes} min`;
  }

  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return `In ${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }

  const days = Math.round(hours / 24);
  return `In ${days} ${days === 1 ? 'day' : 'days'}`;
};

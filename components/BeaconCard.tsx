import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Beacon } from '../types';
import {
  CATEGORY_LABELS,
  formatRelativeTime,
  JOIN_POLICY_LABELS,
} from '../utils/beaconPresentation';

type BeaconCardProps = {
  beacon: Beacon;
  onPress: () => void;
};

const BeaconCard = ({ beacon, onPress }: BeaconCardProps) => (
  <TouchableOpacity
    style={styles.card}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={`View ${beacon.title} details`}
  >
    <View style={styles.headerRow}>
      <Text style={styles.title}>{beacon.title}</Text>
      <Text style={styles.category}>{CATEGORY_LABELS[beacon.category]}</Text>
    </View>

    <Text style={styles.relativeTime}>{formatRelativeTime(beacon.event_time)}</Text>
    <Text style={styles.info}>{new Date(beacon.event_time).toLocaleString()}</Text>

    <View style={styles.metaRow}>
      <Text style={styles.info}>
        {beacon.creator.name?.trim() || 'Beacon creator'}
      </Text>
      <Text style={styles.policy}>{JOIN_POLICY_LABELS[beacon.join_policy]}</Text>
    </View>

    <View style={styles.footerRow}>
      <Text
        style={styles.reliability}
        accessibilityLabel={`Reliability ${beacon.creator.reliability_score}`}
      >
        Reliability {beacon.creator.reliability_score}
      </Text>
      <Text style={styles.capacity}>
        {beacon.joined_count}/{beacon.max_participants}
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFDFB',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#D4B29B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0DED3',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    color: '#2B201E',
    fontSize: 18,
    fontWeight: '800',
    flex: 1,
    marginRight: 8,
  },
  category: {
    color: '#734A26',
    fontSize: 11,
    fontWeight: '800',
    backgroundColor: '#F7D7B6',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    overflow: 'hidden',
  },
  relativeTime: {
    color: '#E08A4A',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  info: {
    color: '#6B4F45',
    fontSize: 13,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  policy: {
    color: '#2A201C',
    fontSize: 11,
    fontWeight: '700',
    backgroundColor: '#F0E2D8',
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  capacity: {
    color: '#5B463E',
    fontSize: 12,
    fontWeight: '700',
  },
  reliability: {
    alignSelf: 'flex-start',
    color: '#ffffff',
    backgroundColor: '#E09A53',
    borderRadius: 12,
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 5,
    overflow: 'hidden',
  },
});

export default BeaconCard;

import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Beacon } from '../../types';
import { showAuthRequiredAlert } from '../../utils/authGuard';
import {
  CATEGORY_LABELS,
  JOIN_POLICY_LABELS,
} from '../../utils/beaconPresentation';

type BeaconDetailScreenProps = {
  route?: {
    params: {
      beacon: Beacon;
      guestMode?: boolean;
    };
  };
};

const BeaconDetailScreen = ({ route }: BeaconDetailScreenProps) => {
  const navigation = useNavigation<any>();
  const params = route?.params;
  if (!params?.beacon) {
    throw new Error('BeaconDetailScreen requires a Beacon route parameter.');
  }

  const { beacon, guestMode = false } = params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.category}>{CATEGORY_LABELS[beacon.category]}</Text>
        <Text style={styles.title}>{beacon.title}</Text>
        {beacon.description ? (
          <Text style={styles.description}>{beacon.description}</Text>
        ) : null}
        <Text style={styles.label}>When</Text>
        <Text style={styles.value}>{new Date(beacon.event_time).toLocaleString()}</Text>
        <Text style={styles.label}>Created by</Text>
        <Text style={styles.value}>
          {beacon.creator.name?.trim() || 'Beacon creator'}
        </Text>
        <Text style={styles.label}>Reliability score</Text>
        <Text style={styles.value}>{beacon.creator.reliability_score}</Text>
        <Text style={styles.label}>Join policy</Text>
        <Text style={styles.value}>{JOIN_POLICY_LABELS[beacon.join_policy]}</Text>
        <Text style={styles.label}>Participants</Text>
        <Text style={styles.value}>
          {beacon.joined_count} of {beacon.max_participants} joined
        </Text>
      </View>
      {guestMode && (
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => showAuthRequiredAlert(navigation)}
          accessibilityRole="button"
        >
          <Text style={styles.primaryButtonText}>Join</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        accessibilityRole="button"
      >
        <Text style={styles.backButtonText}>Back to feed</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  category: {
    color: '#007AFF',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  title: {
    color: '#333',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    color: '#555',
    fontSize: 16,
    marginBottom: 16,
  },
  label: {
    color: '#777',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  value: {
    color: '#333',
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    alignItems: 'center',
    padding: 14,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BeaconDetailScreen;

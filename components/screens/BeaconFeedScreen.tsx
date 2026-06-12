import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { showAuthRequiredAlert } from '../../utils/authGuard';

const BeaconFeedScreen = () => {
  const navigation = useNavigation<any>();

  const handleGatedAction = () => {
    showAuthRequiredAlert(navigation);
  };

  return (
    <View style={styles.container}>
      <View style={styles.guestBanner}>
        <Text style={styles.guestBannerText}>
          You're browsing as a guest. Sign in to join activities.
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.guestBannerLink}>Sign In</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={[]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={() => null}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Beacons yet</Text>
            <Text style={styles.emptySubtitle}>
              Be the first to post an activity in your area.
            </Text>
            <TouchableOpacity
              style={styles.signInButton}
              onPress={handleGatedAction}
            >
              <Text style={styles.signInButtonText}>Sign in to Post</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  guestBanner: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  guestBannerText: {
    color: 'white',
    fontSize: 13,
    flex: 1,
    marginRight: 8,
  },
  guestBannerLink: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  listContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 80,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  signInButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  signInButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BeaconFeedScreen;

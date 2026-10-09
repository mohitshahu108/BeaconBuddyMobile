import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Beacon } from '../../types';
import { apiService } from '../../services/api';
import { showAuthRequiredAlert } from '../../utils/authGuard';
import BeaconCard from '../BeaconCard';

type BeaconFeedScreenProps = {
  guestMode?: boolean;
  headerContent?: ReactElement;
  footerContent?: ReactElement;
};

const BeaconFeedScreen = ({
  guestMode = true,
  headerContent,
  footerContent,
}: BeaconFeedScreenProps) => {
  const navigation = useNavigation<any>();
  const [beacons, setBeacons] = useState<Beacon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const activeRequest = useRef(0);

  const loadBeacons = useCallback(async (refresh: boolean) => {
    const requestId = ++activeRequest.current;
    setError(null);
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const result = await apiService.getBeacons();
      if (requestId === activeRequest.current) {
        setBeacons(result);
      }
    } catch (requestError) {
      if (requestId === activeRequest.current) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load Beacons. Please try again.',
        );
      }
    } finally {
      if (requestId === activeRequest.current) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    loadBeacons(false);
    return () => {
      activeRequest.current += 1;
    };
  }, [loadBeacons]);

  const handleGatedAction = () => {
    showAuthRequiredAlert(navigation);
  };

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.stateContainer}>
          <ActivityIndicator
            testID="feed-loading"
            size="large"
            color="#007AFF"
          />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.stateContainer}>
          <Text style={styles.stateTitle}>Couldn’t load Beacons</Text>
          <Text style={styles.stateMessage}>{error}</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => loadBeacons(false)}
            accessibilityRole="button"
          >
            <Text style={styles.actionButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.stateContainer}>
        <Text style={styles.stateTitle}>No Beacons nearby</Text>
        <Text style={styles.stateMessage}>
          Check back later for activities in your area.
        </Text>
      </View>
    );
  };

  const guestBanner = guestMode ? (
    <View style={styles.guestBanner}>
      <Text style={styles.guestBannerText}>
        You're browsing as a guest. Sign in to join activities.
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        accessibilityRole="button"
      >
        <Text style={styles.guestBannerLink}>Sign In</Text>
      </TouchableOpacity>
    </View>
  ) : null;

  const listHeader = (
    <View>
      {guestBanner}
      {headerContent}
      {error && beacons.length > 0 && (
        <View style={styles.refreshError}>
          <Text style={styles.refreshErrorText}>{error}</Text>
          <TouchableOpacity
            onPress={() => loadBeacons(true)}
            accessibilityRole="button"
          >
            <Text style={styles.retryLink}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        testID="beacon-feed-list"
        data={beacons}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <BeaconCard
            beacon={item}
            onPress={() => navigation.navigate('BeaconDetail', { beacon: item, guestMode })}
          />
        )}
        refreshing={isRefreshing}
        onRefresh={() => loadBeacons(true)}
        ListHeaderComponent={listHeader}
        ListFooterComponent={
          guestMode ? (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleGatedAction}
              accessibilityRole="button"
            >
              <Text style={styles.actionButtonText}>Create Beacon</Text>
            </TouchableOpacity>
          ) : (
            footerContent
          )
        }
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4DED1',
  },
  listContent: {
    flexGrow: 1,
    padding: 16,
  },
  guestBanner: {
    backgroundColor: '#D77E59',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: -16,
    marginTop: -16,
    marginBottom: 16,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  guestBannerText: {
    color: '#fff',
    fontSize: 13,
    flex: 1,
    marginRight: 8,
    fontWeight: '600',
  },
  guestBannerLink: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  stateContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 240,
  },
  stateTitle: {
    color: '#333',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  stateMessage: {
    color: '#666',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  refreshError: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF3F2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  refreshErrorText: {
    color: '#B42318',
    flex: 1,
    marginRight: 12,
  },
  retryLink: {
    color: '#007AFF',
    fontWeight: '700',
  },
});

export default BeaconFeedScreen;

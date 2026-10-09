import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import BeaconFeedScreen from './BeaconFeedScreen';

const HomeScreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation<any>();

  return (
    <BeaconFeedScreen
      guestMode={false}
      headerContent={
        <View style={styles.composeCard}>
          <Text style={styles.heading}>Create a New Beacon</Text>
          <Text style={styles.subheading}>What do you feel like doing?</Text>

          <View style={styles.searchBox}>
            <Text style={styles.searchText}>Search or type activity</Text>
          </View>

          <Text style={styles.sectionTitle}>Premade Activities</Text>
          <View style={styles.tagRow}>
            {['Movie', 'Sports', 'Coffee & Chat'].map((item, index) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.tag,
                  index === 0 && styles.tagPrimary,
                  index === 1 && styles.tagDanger,
                  index === 2 && styles.tagMuted,
                ]}
              >
                <Text
                  style={[
                    styles.tagText,
                    index === 0 && styles.tagTextPrimary,
                    index === 1 && styles.tagTextDanger,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Custom Activities</Text>
          <TextInput
            style={styles.field}
            value=""
            placeholder="Activity Title"
            placeholderTextColor="#A38373"
          />
          <TextInput
            style={styles.field}
            value=""
            placeholder="Place to Visit"
            placeholderTextColor="#A38373"
          />

          <TouchableOpacity style={styles.primaryButton} accessibilityRole="button">
            <Text style={styles.primaryButtonText}>Next: Time &amp; Date</Text>
          </TouchableOpacity>
        </View>
      }
      footerContent={
        <View style={styles.accountActions}>
          <TouchableOpacity
            style={styles.linkPasswordButton}
            onPress={() => navigation.navigate('LinkPassword')}
            accessibilityRole="button"
          >
            <Text style={styles.linkPasswordButtonText}>Link Password</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => void logout()}
            accessibilityRole="button"
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  composeCard: {
    backgroundColor: '#F5E6DC',
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#D7B7A7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#2f201b',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    color: '#6b4f45',
    marginBottom: 18,
  },
  searchBox: {
    backgroundColor: '#FDF8F5',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E9D5C8',
    marginBottom: 18,
  },
  searchText: {
    color: '#A38A80',
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 15,
    color: '#664D45',
    fontWeight: '700',
    marginBottom: 12,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },
  tag: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginRight: 8,
    marginBottom: 8,
  },
  tagPrimary: {
    backgroundColor: '#F4C7A0',
  },
  tagDanger: {
    backgroundColor: '#F7B4A8',
  },
  tagMuted: {
    backgroundColor: '#E5E5E5',
  },
  tagText: {
    color: '#2B201E',
    fontSize: 13,
    fontWeight: '700',
  },
  tagTextPrimary: {
    color: '#734A26',
  },
  tagTextDanger: {
    color: '#7A2D2D',
  },
  field: {
    backgroundColor: '#FDF8F5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E7D9CF',
    color: '#2f201b',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#E18B54',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 6,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  accountActions: {
    paddingTop: 12,
  },
  linkPasswordButton: {
    backgroundColor: '#E18B54',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  linkPasswordButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  logoutButton: {
    backgroundColor: '#D7C7BE',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#3a2d29',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default HomeScreen;

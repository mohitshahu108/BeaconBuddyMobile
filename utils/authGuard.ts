import { Alert } from 'react-native';

/**
 * Shows an alert prompting the guest user to sign in before performing
 * an action that requires authentication (e.g., joining or creating a Beacon).
 */
export const showAuthRequiredAlert = (navigation: any): void => {
  Alert.alert(
    'Sign In Required',
    'You need an account to join activities.',
    [
      {
        text: 'Sign In',
        onPress: () => navigation.navigate('Login'),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ],
  );
};

/**
 * Unit tests for authGuard utility
 * Story 1.2 — Guest Mode Mobile Entry Point (AC: 4)
 */

import { Alert } from 'react-native';
import { showAuthRequiredAlert } from '../utils/authGuard';

jest.spyOn(Alert, 'alert');

describe('showAuthRequiredAlert', () => {
  const mockNavigation = { navigate: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls Alert.alert with correct title and message', () => {
    showAuthRequiredAlert(mockNavigation);
    expect(Alert.alert).toHaveBeenCalledWith(
      'Sign In Required',
      'You need an account to join activities.',
      expect.any(Array),
    );
  });

  it('provides a Sign In button that navigates to Login', () => {
    showAuthRequiredAlert(mockNavigation);
    const [, , buttons] = (Alert.alert as jest.Mock).mock.calls[0];
    const signInButton = buttons.find((b: any) => b.text === 'Sign In');
    expect(signInButton).toBeDefined();
    signInButton.onPress();
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
  });

  it('provides a Cancel button with cancel style', () => {
    showAuthRequiredAlert(mockNavigation);
    const [, , buttons] = (Alert.alert as jest.Mock).mock.calls[0];
    const cancelButton = buttons.find((b: any) => b.text === 'Cancel');
    expect(cancelButton).toBeDefined();
    expect(cancelButton.style).toBe('cancel');
  });
});

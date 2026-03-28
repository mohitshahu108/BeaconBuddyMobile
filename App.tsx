/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { useEffect } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, Alert, Button} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { GoogleSignin } from '@react-native-google-signin/google-signin';


 function App() {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '803278777588-7aicjs72fo7q51n6hs1eo12ntec3rgov.apps.googleusercontent.com',
      offlineAccess: false,
    });
  }, []);

  const signIn = async () => {
    try {
      console.log('hasPlayServices');
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo?.data?.idToken;

      const response = await fetch('http://10.0.2.2:3000/api/v1/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_token: idToken,
      }),
    });

    const data = await response.json();

    console.log('RAILS RESPONSE:', data);
    Alert.alert('BeaconBuddy', 'Logged in successfully!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{ marginTop: 100 }}>
      <Button title="Sign in with Google" onPress={signIn} />
    </View>
  );
}

// function App() {
//   const isDarkMode = useColorScheme() === 'dark';

//   return (
//     <SafeAreaProvider>
//       <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
//       <AppContent />
//     </SafeAreaProvider>
//   );
// }

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;

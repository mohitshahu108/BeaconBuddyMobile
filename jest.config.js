module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '@react-native-async-storage/async-storage':
      '<rootDir>/__mocks__/@react-native-async-storage/async-storage.js',
    '@react-native-google-signin/google-signin':
      '<rootDir>/__mocks__/@react-native-google-signin/google-signin.js',
    '@react-navigation/native':
      '<rootDir>/__mocks__/@react-navigation/native.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@testing-library)/)',
  ],
};

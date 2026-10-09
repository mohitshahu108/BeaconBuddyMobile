import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

type BrandLogoProps = {
  size?: number;
  showLabel?: boolean;
  labelSize?: number;
};

const BrandLogo = ({
  size = 44,
  showLabel = true,
  labelSize = 18,
}: BrandLogoProps) => {
  return (
    <View style={styles.row}>
      <Image
        source={require('../assets/brand-logo.png')}
        style={[styles.icon, { width: size * 1.62, height: size }]}
        resizeMode="contain"
      />
      {showLabel ? (
        <Text style={[styles.label, { fontSize: labelSize }]}>Beacon Buddy</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 12,
  },
  label: {
    color: '#2D201C',
    fontWeight: '700',
    letterSpacing: -0.5,
  },
});

export default BrandLogo;

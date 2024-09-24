import React from 'react';
import {useRideContext} from '../commons/rides/context';
import {Stepper, View} from '@ant-design/react-native';
import {StyleSheet, Text} from 'react-native';
import {
  COLOR_DARK_MODE_PRIMARY,
  useDarkModeContext,
} from '../commons/DarkModeContext';
import {SecurityLevel} from '../commons/types';
import {fetchGeocodeRouting} from '../commons/middleware/tools';

export const COLOR_DANGER = '#D32F2F';
export const COLOR_WARNING = '#F57C00';
export const COLOR_SAFE = '#388E3C';

export default function SecurityLevelIndicator() {
  const {securityLevel, setSecurityLevel} = useRideContext();
  const {destination, position, setRideGeometry} = useRideContext();
  const {isDarkMode} = useDarkModeContext();

  const getColorFromLevel = (level: SecurityLevel) => {
    switch (level) {
      case 'driving-traffic':
        return COLOR_DANGER;
      case 'cycling':
        return COLOR_WARNING;
      case 'walking':
        return COLOR_SAFE;
    }
  };

  const getLevelFromNumber = (nb: number) => {
    switch (nb) {
      case 1:
        return 'driving-traffic';
      case 2:
        return 'cycling';
      case 3:
        return 'walking';
    }
  };

  const getNumberFromLevel = (level: SecurityLevel) => {
    switch (level) {
      case 'driving-traffic':
        return 1;
      case 'cycling':
        return 2;
      case 'walking':
        return 3;
    }
  };

  const handleChange = async (nb: any) => {
    const level = getLevelFromNumber(nb)!;
    setSecurityLevel(level);
    if (destination) {
      const newRideGeometry = await fetchGeocodeRouting(
        position!,
        destination,
        level,
      );
      setRideGeometry(newRideGeometry);
    }
  };

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: !isDarkMode ? COLOR_DARK_MODE_PRIMARY : 'white',
      }}>
      <Text style={{color: getColorFromLevel(securityLevel)}}>
        Security level
      </Text>
      <Stepper
        step={1}
        min={1}
        max={3}
        value={getNumberFromLevel(securityLevel)}
        onChange={handleChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: '50%',
    bottom: 60,
    transform: [{translateX: -75}],
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 75,
    borderRadius: 20,
    width: 150,
  },
});

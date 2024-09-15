import {View} from '@ant-design/react-native';
import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {Location} from 'react-native-location';
import MapView from 'react-native-maps';

import RNLocation from 'react-native-location';

export default function PageRoadlineView() {
  RNLocation.requestPermission({
    ios: 'whenInUse',
    android: {
      detail: 'fine',
    },
  }).then((granted: boolean) => {
    if (granted) {
      RNLocation.subscribeToLocationUpdates((locations: Location[]) => {
        console.log(locations);
      });
    }
  });

  RNLocation.getLatestLocation().then(console.log);

  return (
    <View style={styles.container}>
      <MapView style={styles.mapStyle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  mapStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

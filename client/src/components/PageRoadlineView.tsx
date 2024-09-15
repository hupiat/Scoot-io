import {View} from '@ant-design/react-native';
import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import MapView, {Marker, MarkerAnimated} from 'react-native-maps';
import * as Location from 'expo-location';

export default function PageRoadlineView() {
  const [position, setPosition] = useState<Location.LocationObjectCoords>();

  useEffect(() => {
    // Permissions are requested from the login page
    Location.getCurrentPositionAsync().then(location =>
      setPosition(location.coords),
    );
  }, [Location, setPosition]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.mapStyle}
        region={
          position
            ? {
                latitude: position.latitude,
                longitude: position.longitude,
                latitudeDelta: 0,
                longitudeDelta: 0,
              }
            : undefined
        }>
        {position && (
          <MarkerAnimated
            coordinate={{
              latitude: position.latitude,
              longitude: position.longitude,
            }}
          />
        )}
      </MapView>
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

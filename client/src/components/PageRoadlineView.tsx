import {View} from '@ant-design/react-native';
import React, {useEffect, useState} from 'react';
import {Dimensions, ImageURISource, StyleSheet} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import MarkerScooter from '../assets/marker.png';

const TIMEOUT_DELAY_LOCATION_MS = 500;

export default function PageRoadlineView() {
  const [position, setPosition] = useState<Location.LocationObjectCoords>();

  useEffect(() => {
    // Permissions are requested from the login page
    let timeoutId: NodeJS.Timeout;
    const timeout = () => {
      Location.getCurrentPositionAsync().then(location =>
        setPosition(location.coords),
      );
      timeoutId = setTimeout(timeout, TIMEOUT_DELAY_LOCATION_MS);
    };
    timeout();
    return () => clearTimeout(timeoutId);
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
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
            : undefined
        }>
        {position && (
          <Marker
            coordinate={{
              latitude: position.latitude,
              longitude: position.longitude,
            }}
            image={require('../assets/marker.png')}
            style={{width: 50, height: 50}}
          />
        )}
        <MapViewDirections
          apikey="AIzaSyC5K8oefgx7p-owCOLThF38oSnYhQAPFVI"
          mode="BICYCLING"
          optimizeWaypoints
        />
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

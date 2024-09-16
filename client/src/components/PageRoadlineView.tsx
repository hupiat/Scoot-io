import {View} from '@ant-design/react-native';
import React, {useEffect, useState} from 'react';
import {Button, Dimensions, StyleSheet, Text} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import SearchInputLocations from './SearchInputLocations';
import {GOOGLE_WEB_API_KEY} from '../commons/_local_constants';
import {GeoCode} from '../commons/types';
import Toast from 'react-native-toast-message';

const TIMEOUT_DELAY_LOCATION_MS = 500;

export default function PageRoadlineView() {
  const [position, setPosition] = useState<GeoCode>();
  const [destination, setDestination] = useState<GeoCode | null>(null);

  useEffect(() => {
    // Permissions are requested from the login page
    let timeoutId: NodeJS.Timeout;
    const timeout = () => {
      Location.getCurrentPositionAsync().then(location => {
        setPosition(location.coords);
      });
      timeoutId = setTimeout(timeout, TIMEOUT_DELAY_LOCATION_MS);
    };
    timeout();
    return () => clearTimeout(timeoutId);
  }, [Location, setPosition]);

  useEffect(() => {
    if (position === destination) {
      setDestination(null);
      Toast.show({
        type: 'info',
        text1: 'Trip',
        text2: 'You have been arrived',
      });
    }
  }, [position]);

  return (
    <>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.mapStyle}
          showsMyLocationButton
          showsTraffic
          showsScale
          initialRegion={
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
          {destination && (
            <MapViewDirections
              apikey={GOOGLE_WEB_API_KEY}
              mode="BICYCLING"
              optimizeWaypoints
              origin={position}
              destination={destination}
              strokeWidth={5}
            />
          )}
        </MapView>
      </View>
      <View style={styles.searchContainer}>
        <SearchInputLocations
          onSelectPlace={place =>
            setDestination({
              latitude: place.geometry.latitude,
              longitude: place.geometry.longitude,
            })
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    position: 'absolute',
    width: '100%',
    top: 30,
  },
  mapStyle: {
    flex: 1,
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    bottom: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  mapContainer: {
    flex: 1,
  },
});

import {Icon, Modal, View} from '@ant-design/react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import SearchInputLocations from './SearchInputLocations';
import {GOOGLE_WEB_API_KEY} from '../commons/_local_constants';
import {GeoCode} from '../commons/types';
import {useRideContext} from '../commons/rides/context';
import {FloatingAction} from 'react-native-floating-action';
import {useStoreDataRides} from '../commons/middleware/hooks';

export default function PageRoadlineView() {
  const [position, setPosition] = useState<GeoCode>();
  const {destination, setDestination, region, setRegion} = useRideContext();
  const [, storeDataRides] = useStoreDataRides();

  useEffect(() => {
    if (position) {
      setRegion({
        latitude: position.latitude,
        longitude: position.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [position]);

  useEffect(() => {
    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        distanceInterval: 10,
        mayShowUserSettingsDialog: true,
        timeInterval: 5000,
      },
      location => setPosition(location.coords),
    );
  }, []);

  return (
    <>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.mapStyle}
          showsTraffic
          showsScale
          showsBuildings
          showsCompass
          showsIndoorLevelPicker
          showsIndoors
          showsPointsOfInterest
          showsMyLocationButton
          onRegionChangeComplete={setRegion}
          initialRegion={region}>
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
          {position && destination && (
            <MapViewDirections
              apikey={GOOGLE_WEB_API_KEY}
              mode="BICYCLING"
              optimizeWaypoints
              origin={position}
              destination={destination || undefined}
              strokeWidth={5}
            />
          )}
        </MapView>
      </View>
      <View style={styles.searchContainer}>
        <SearchInputLocations
          hideResults={!!destination}
          onSelectPlace={place =>
            setDestination({
              latitude: place.geometry.latitude,
              longitude: place.geometry.longitude,
            })
          }
        />
      </View>
      {!!destination && (
        <View>
          <FloatingAction
            actions={[
              {
                name: 'ride_cancel',
                text: 'Cancel ride',
                icon: <Icon name="poweroff" />,
              },
              {
                name: 'ride_save',
                text: 'Save ride',
                icon: <Icon name="save" />,
              },
              {
                name: 'ride_plothole',
                text: 'Mark plothole as a danger',
                icon: <Icon name="warning" />,
              },
              {
                name: 'ride_dense_traffic',
                text: 'Mark dense traffic',
                icon: <Icon name="car" />,
              },
            ]}
            onPressItem={name => {
              switch (name) {
                case 'ride_cancel':
                  Modal.alert('Confirmation', 'Cancel the current ride ?', [
                    {text: 'Cancel', onPress: () => {}, style: 'cancel'},
                    {text: 'OK', onPress: () => setDestination(null)},
                  ]);
                  break;
                case 'ride_save':
                  Modal.prompt('Confirmation', 'Save the current ride ?', [
                    {text: 'Cancel', onPress: () => {}, style: 'cancel'},
                    {
                      text: 'OK',
                      // Typing error in antd
                      onPress: () =>
                        storeDataRides.add({
                          name: '',
                          destination: destination,
                        }),
                    },
                  ]);
                  break;
              }
            }}
          />
        </View>
      )}
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
    top: 55,
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

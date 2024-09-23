import {Modal, View} from '@ant-design/react-native';
import React, {useDeferredValue, useEffect, useRef, useState} from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import MapView, {Marker, MapPolyline} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import SearchInputLocations from './SearchInputLocations';
import {
  ChargingStation,
  Marker as MarkerBusinessObject,
  MarkerType,
  Place,
} from '../commons/types';
import {useRideContext} from '../commons/rides/context';
import {FloatingAction} from 'react-native-floating-action';
import {
  useStoreDataMarkers,
  useStoreDataRides,
} from '../commons/middleware/hooks';
import {displayErrorToast} from '../commons/tools';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  areCoordinatesEqual,
  fetchChargingStations,
  fetchGeocodeRouting,
  LOCAL_SEARCH_CHARGING_STATIONS_RADIUS_KM,
} from '../commons/middleware/tools';
import Toast from 'react-native-toast-message';
import Voice from '@react-native-voice/voice';
import * as RNLocalize from 'react-native-localize';
import {
  COLOR_DARK_MODE_PRIMARY,
  useDarkModeContext,
} from '../commons/DarkModeContext';
import MyLocationButton from './MyLocationButton';
import SecurityLevelIndicator from './SecurityLevelIndicator';

const DARK_THEME = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: COLOR_DARK_MODE_PRIMARY,
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#FFFFFF',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: COLOR_DARK_MODE_PRIMARY,
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [
      {
        color: '#4b6878',
      },
    ],
  },
  {
    featureType: 'administrative.country',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#4b6878',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#d59563',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: COLOR_DARK_MODE_PRIMARY,
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: COLOR_DARK_MODE_PRIMARY,
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#6b9a76',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#37474f',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#212a31',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#8a8a8a',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [
      {
        color: '#37474f',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry',
    stylers: [
      {
        color: '#4e4e4e',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [
      {
        color: '#2f3948',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#17263c',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#515c6d',
      },
    ],
  },
];

export default function PageRoadlineView() {
  const mapRef = useRef<MapView | null>(null);
  const [isVoiceRecognizing, setIsVoiceRecognizing] = useState<boolean>(false);
  const {
    position,
    setPosition,
    destination,
    setDestination,
    rideGeometry,
    setRideGeometry,
    destinationName,
    setDestinationName,
    securityLevel,
    setSecurityLevel,
  } = useRideContext();
  const [, storeDataRides] = useStoreDataRides();
  const [markersData, storeDataMarkers] = useStoreDataMarkers();
  const [chargingStationsData, setChargingStationsData] =
    useState<ChargingStation[]>();
  const {isDarkMode} = useDarkModeContext();

  const deferredPosition = useDeferredValue(position);

  // Fetching from here is taking in concerns radius filter
  useEffect(() => {
    if (position) {
      // Fetching markers
      storeDataMarkers.fetchAll(position.longitude, position.latitude);
      // Then fetching charging stations
      fetchChargingStations(
        position,
        LOCAL_SEARCH_CHARGING_STATIONS_RADIUS_KM,
      ).then(jsons => setChargingStationsData(jsons));
    }
  }, [position]);

  useEffect(() => {
    Voice.onSpeechResults = (result: any) => {
      const res = result.value as string[];
      // Taking the better prediction
      setDestinationName(res[res.length - 1]);
    };
    Voice.onSpeechEnd = () => setIsVoiceRecognizing(false);
    Voice.onSpeechError = () => setIsVoiceRecognizing(false);
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      location =>
        setPosition({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }),
      () =>
        displayErrorToast({
          name: 'Error',
          message: 'Could not get location',
        }),
      {
        enableHighAccuracy: true,
        accuracy: {
          android: 'high',
        },
      },
    );
    return () => Geolocation.clearWatch(watchId);
  }, []);

  const handlePlaceSelect = async (place: Place) => {
    const coords = await fetchGeocodeRouting(
      position!,
      place.geometry,
      securityLevel,
    );
    setDestinationName(place.name);
    setDestination({
      latitude: place.geometry.latitude,
      longitude: place.geometry.longitude,
    });
    setRideGeometry(coords);
  };

  const plotholesMarkers = markersData?.filter(
    marker => marker.type === 'plothole',
  );
  const denseTrafficMarkers = markersData?.filter(
    marker => marker.type === 'dense_traffic',
  );

  const handleDeleteMarker = (marker: MarkerBusinessObject) => {
    Modal.alert('Confirmation', 'Delete this marker ?', [
      {text: 'Cancel', onPress: () => {}, style: 'cancel'},
      {
        text: 'OK',
        onPress: () => {
          storeDataMarkers.delete(marker.id).then(() => {
            Toast.show({
              type: 'success',
              text1: 'DELETE',
              text2: 'Marker has been deleted !',
            });
          });
        },
      },
    ]);
  };

  const handleAddMarker = (type: MarkerType) => {
    if (
      markersData?.some(markerData =>
        areCoordinatesEqual(markerData.geometry, position!),
      )
    ) {
      displayErrorToast({
        name: 'Error',
        message: 'Already declared',
      });
      return;
    }
    const obj = {
      type: type,
      geometry: position!,
    };
    storeDataMarkers
      .add(obj as any)
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'ADD',
          text2: 'Marker has been added !',
        });
      })
      .catch(() =>
        displayErrorToast({
          name: 'Error',
          message: 'Already declared',
        }),
      );
  };

  const resetRide = () => {
    setDestination(null);
    setDestinationName(null);
    setRideGeometry(null);
  };

  useEffect(() => {
    if (position && destination && areCoordinatesEqual(position, destination)) {
      resetRide();
      Toast.show({
        type: 'info',
        text1: 'Ride',
        text2: 'You are arrived !',
        autoHide: false,
      });
    }
  }, [position]);

  return (
    <>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.mapStyle}
          showsTraffic
          showsScale
          showsBuildings
          showsCompass
          showsIndoorLevelPicker
          showsIndoors
          showsPointsOfInterest
          customMapStyle={isDarkMode ? DARK_THEME : undefined}
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
          {deferredPosition && (
            <Marker
              coordinate={{
                latitude: deferredPosition.latitude,
                longitude: deferredPosition.longitude,
              }}
              image={
                isDarkMode
                  ? require('../assets/marker_dark_mode.png')
                  : require('../assets/marker.png')
              }
            />
          )}
          {deferredPosition && destination && rideGeometry && (
            <MapPolyline
              strokeWidth={5}
              coordinates={rideGeometry}
              strokeColor={isDarkMode ? 'white' : undefined}
            />
          )}
          {plotholesMarkers &&
            plotholesMarkers.map(marker => (
              <Marker
                key={marker.id}
                coordinate={{
                  latitude: marker.geometry.latitude,
                  longitude: marker.geometry.longitude,
                }}
                image={require('../assets/marker_plothole.png')}
                onSelect={() => handleDeleteMarker(marker)}
              />
            ))}
          {denseTrafficMarkers &&
            denseTrafficMarkers.map(marker => (
              <Marker
                key={marker.id}
                coordinate={{
                  latitude: marker.geometry.latitude,
                  longitude: marker.geometry.longitude,
                }}
                image={require('../assets/marker_dense_traffic.png')}
                onSelect={() => handleDeleteMarker(marker)}
              />
            ))}
          {chargingStationsData &&
            chargingStationsData.map(chargingStation => (
              <Marker
                key={chargingStation.id}
                coordinate={{
                  latitude: chargingStation.geometry.latitude,
                  longitude: chargingStation.geometry.longitude,
                }}
                image={require('../assets/marker_charging_station.png')}
                onSelect={() =>
                  Modal.alert('Informations', chargingStation.name, [
                    {
                      text: 'Go',
                      onPress: async () => {
                        const coords = await fetchGeocodeRouting(
                          position!,
                          chargingStation.geometry,
                          securityLevel,
                        );
                        setRideGeometry(coords);
                        setDestination(chargingStation.geometry);
                        setDestinationName(chargingStation.name);
                      },
                    },
                    {text: 'Close'},
                  ])
                }
              />
            ))}
        </MapView>
      </View>
      <View style={styles.searchContainer}>
        <SearchInputLocations
          hideResults={!!destination}
          onSelectPlace={handlePlaceSelect}
          forceDisplay={destinationName || undefined}
        />
      </View>
      {!destination && (
        <View>
          <FloatingAction
            overrideWithAction
            actions={[
              {
                name: 'speech_recognize',
                icon: (
                  <Icon
                    name={!isVoiceRecognizing ? 'microphone' : 'close'}
                    color={'white'}
                    size={30}
                  />
                ),
              },
            ]}
            onPressItem={async () => {
              if (!isVoiceRecognizing) {
                if (await Voice.isAvailable()) {
                  Voice.start(RNLocalize.getLocales()[0].languageTag);
                  setIsVoiceRecognizing(true);
                }
              } else {
                Voice.stop();
                setIsVoiceRecognizing(false);
              }
            }}
          />
        </View>
      )}
      <MyLocationButton
        onPress={() => {
          if (position) {
            mapRef.current?.animateToRegion({
              latitude: position.latitude,
              longitude: position.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          }
        }}
      />
      <SecurityLevelIndicator />
      {!!destination && (
        <View>
          <FloatingAction
            actions={[
              {
                name: 'ride_cancel',
                text: 'Cancel',
                icon: <Icon name="power-off" color={'white'} size={15} />,
              },
              {
                name: 'ride_save',
                text: 'Save',
                icon: <Icon name="save" color={'white'} size={15} />,
              },
              {
                name: 'ride_plothole',
                text: 'Plothole',
                icon: <Icon name="warning" color={'white'} size={15} />,
              },
              {
                name: 'ride_dense_traffic',
                text: 'Dense traffic',
                icon: <Icon name="car" color={'white'} size={15} />,
              },
            ]}
            onPressItem={name => {
              switch (name) {
                case 'ride_cancel':
                  Modal.alert('Confirmation', 'Cancel the current ride ?', [
                    {text: 'Cancel', onPress: () => {}, style: 'cancel'},
                    {
                      text: 'OK',
                      onPress: resetRide,
                    },
                  ]);
                  break;
                case 'ride_save':
                  Modal.alert('Confirmation', 'Save the current ride ?', [
                    {text: 'Cancel', onPress: () => {}, style: 'cancel'},
                    {
                      text: 'OK',
                      onPress: () =>
                        storeDataRides
                          .add({
                            name: destinationName!,
                            destination: destination,
                          })
                          .then(() => {
                            Toast.show({
                              type: 'success',
                              text1: 'ADD',
                              text2: 'Ride has been saved !',
                            });
                          })
                          .catch(() =>
                            displayErrorToast({
                              name: 'Error',
                              message: 'This ride is already in base',
                            }),
                          ),
                    },
                  ]);
                  break;
                case 'ride_plothole':
                  handleAddMarker('plothole');
                  break;
                case 'ride_dense_traffic':
                  handleAddMarker('dense_traffic');
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
    top: 0,
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

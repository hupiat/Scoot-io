import {
  ActivityIndicator,
  Input,
  List,
  Modal,
  View,
} from '@ant-design/react-native';
import React, {useDeferredValue, useEffect, useMemo, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useStoreDataRides} from '../commons/middleware/hooks';
import dayjs from 'dayjs';
import {useRideContext} from '../commons/rides/context';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  computePathDistanceKm,
  fetchGeocodeRouting,
} from '../commons/middleware/tools';
import Toast from 'react-native-toast-message';
import {
  COLOR_DARK_MODE_PRIMARY,
  COLOR_PRIMARY,
  useDarkModeContext,
} from '../commons/DarkModeContext';
import {Ride} from '../commons/types';
import ButtonClearSearch from './ButtonClearSearch';

export default function PageRidesView() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [ridesData, storeDataRides] = useStoreDataRides();
  const {
    setDestination,
    position,
    setDestinationName,
    setRideGeometry,
    securityLevel,
  } = useRideContext();
  const {isDarkMode} = useDarkModeContext();

  const deferredSearchQuery = useDeferredValue(searchQuery);

  let filteredAndSortedRidesData = useMemo<Ride[] | undefined>(() => {
    if (ridesData) {
      let res = [...ridesData];
      if (deferredSearchQuery) {
        res = res.filter(data => {
          const words = data.name.split(' ');
          for (const word of words) {
            if (
              word
                .toLocaleLowerCase()
                .startsWith(deferredSearchQuery.toLocaleLowerCase())
            ) {
              return true;
            }
          }
          return false;
        });
      }
      res.sort((a, b) => {
        const aDist = computePathDistanceKm(position!, a.destination);
        const bDist = computePathDistanceKm(position!, b.destination);
        return aDist - bDist;
      });
      return res;
    }
  }, [ridesData, deferredSearchQuery]);

  if (!ridesData) {
    return (
      <ActivityIndicator
        size={'large'}
        color={COLOR_PRIMARY}
        styles={{
          spinner: styles.indicator,
        }}
      />
    );
  }

  const emptyMessageStyle = {
    ...styles.emptyMessage,
    color: isDarkMode ? 'white' : undefined,
  };

  return (
    <ScrollView style={styles.scrollView} stickyHeaderIndices={[1]}>
      <Text
        style={{
          ...styles.title,
          color: isDarkMode ? 'white' : 'black',
        }}>
        Rides Management
      </Text>
      <Input
        placeholder="Search"
        value={searchQuery}
        onChangeText={setSearchQuery}
        suffix={<ButtonClearSearch onPress={() => setSearchQuery('')} />}
        inputStyle={{
          color: isDarkMode ? 'white' : undefined,
          backgroundColor: isDarkMode ? COLOR_DARK_MODE_PRIMARY : 'white',
        }}
      />
      {ridesData.length ? (
        <List>
          {filteredAndSortedRidesData!.map(ride => (
            <TouchableOpacity
              key={ride.id}
              onPress={() => {
                Modal.alert('Confirmation', 'Start this ride ?', [
                  {text: 'Cancel', onPress: () => {}, style: 'cancel'},
                  {
                    text: 'OK',
                    onPress: async () => {
                      const coords = await fetchGeocodeRouting(
                        position!,
                        ride.destination,
                        securityLevel,
                      );
                      setRideGeometry(coords);
                      setDestination(ride.destination);
                      setDestinationName(ride.name);
                    },
                  },
                ]);
              }}>
              <List.Item
                style={{
                  backgroundColor: isDarkMode
                    ? COLOR_DARK_MODE_PRIMARY
                    : undefined,
                }}>
                <View
                  style={{
                    color: isDarkMode ? 'white' : undefined,
                    padding: 10,
                  }}>
                  {ride.name} ({dayjs(ride.dateCreation).format('DD/MM/YYYY')})
                  {'\n\n'}
                  {computePathDistanceKm(position!, ride.destination)} km
                </View>
                <TouchableOpacity
                  style={styles.deleteIcon}
                  onPress={() => {
                    Modal.alert('Confirmation', 'Delete this ride ?', [
                      {text: 'Cancel', onPress: () => {}, style: 'cancel'},
                      {
                        text: 'OK',
                        onPress: () => {
                          storeDataRides.delete(ride.id).then(() =>
                            Toast.show({
                              type: 'success',
                              text1: 'DELETE',
                              text2: 'Ride has been deleted !',
                            }),
                          );
                        },
                      },
                    ]);
                  }}>
                  <Icon
                    name="trash-o"
                    size={30}
                    color={isDarkMode ? 'white' : undefined}
                  />
                </TouchableOpacity>
              </List.Item>
            </TouchableOpacity>
          ))}
        </List>
      ) : (
        <>
          <Text style={emptyMessageStyle}>No data have been found :-(</Text>
          <Text style={emptyMessageStyle}>Start riding !</Text>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 50,
    marginTop: 35,
    marginLeft: 10,
    marginBottom: 25,
    color: 'black',
  },
  emptyMessage: {
    fontSize: 25,
    marginTop: 55,
    marginLeft: 10,
  },
  scrollView: {
    flex: 1,
    marginTop: 20,
    width: Dimensions.get('window').width,
    height: 200,
  },
  deleteIcon: {
    alignSelf: 'flex-end',
  },
  indicator: {
    position: 'relative',
    top: 325,
  },
});

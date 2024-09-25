import {
  ActivityIndicator,
  Checkbox,
  Input,
  List,
  Modal,
  View,
} from '@ant-design/react-native';
import React, {useDeferredValue, useMemo, useState} from 'react';
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
import {fetchGeocodeRouting} from '../commons/middleware/tools';
import Toast from 'react-native-toast-message';
import {
  COLOR_DARK_MODE_PRIMARY,
  COLOR_PRIMARY,
  useDarkModeContext,
} from '../commons/DarkModeContext';
import {Ride} from '../commons/types';
import ButtonClearSearch from './ButtonClearSearch';
import {computePathDistanceKm} from '../commons/tools';
import {FloatingAction} from 'react-native-floating-action';
import DataStore from '../commons/middleware/DataStore';
import {API_PREFIX, API_RIDES, URL_BACKEND} from '../commons/middleware/paths';

export default function PageRidesView() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingRideData, setEditingRideData] = useState<Ride | null>(null);
  const [selectedRideData, setSelectedRideData] = useState<Ride[]>([]);
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

  const filteredAndSortedRidesData = useMemo<Ride[] | undefined>(() => {
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
    <>
      <ScrollView style={styles.scrollView} stickyHeaderIndices={[2]}>
        <Text
          style={{
            ...styles.title,
            color: isDarkMode ? 'white' : 'black',
          }}>
          Rides Management
        </Text>
        <Text
          style={{
            ...styles.subtitle,
            color: isDarkMode ? 'white' : 'black',
          }}>
          Press long to update
        </Text>
        <View
          style={{
            ...styles.searchContainer,
            backgroundColor: isDarkMode ? COLOR_DARK_MODE_PRIMARY : 'white',
          }}>
          <Input
            placeholder="Search"
            value={searchQuery}
            onChangeText={setSearchQuery}
            suffix={<ButtonClearSearch onPress={() => setSearchQuery('')} />}
            inputStyle={{
              color: isDarkMode ? 'white' : undefined,
            }}
          />
        </View>
        {ridesData.length ? (
          <List>
            {filteredAndSortedRidesData!.map(ride => (
              <TouchableOpacity
                key={ride.id}
                onLongPress={() =>
                  !editingRideData || editingRideData.id !== ride.id
                    ? setEditingRideData(ride)
                    : setEditingRideData(null)
                }
                onPress={() => {
                  Modal.alert('Confirmation', 'Start this ride ?', [
                    {text: 'Close'},
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
                  thumb={
                    editingRideData && (
                      <Checkbox
                        checked={selectedRideData.includes(ride)}
                        onChange={() => {
                          if (selectedRideData.includes(ride)) {
                            setSelectedRideData(
                              selectedRideData.filter(
                                selected => selected.id !== ride.id,
                              ),
                            );
                          } else {
                            setSelectedRideData([...selectedRideData, ride]);
                          }
                        }}
                      />
                    )
                  }
                  style={{
                    backgroundColor: isDarkMode
                      ? COLOR_DARK_MODE_PRIMARY
                      : undefined,
                  }}>
                  <View
                    style={{
                      display: 'flex',
                      color: isDarkMode ? 'white' : undefined,
                      padding: 10,
                    }}>
                    {editingRideData && editingRideData.id === ride.id ? (
                      <Input
                        value={editingRideData.name}
                        inputStyle={{
                          backgroundColor: isDarkMode
                            ? COLOR_DARK_MODE_PRIMARY
                            : 'white',
                          color: isDarkMode ? 'white' : undefined,
                          position: 'relative',
                          left: -5,
                        }}
                        onChangeText={name =>
                          setEditingRideData({
                            ...editingRideData,
                            name: name,
                          })
                        }
                      />
                    ) : (
                      <Text
                        style={{
                          color: isDarkMode ? 'white' : undefined,
                        }}>
                        {ride.name}
                      </Text>
                    )}{' '}
                    <Text
                      style={{
                        color: isDarkMode ? 'white' : undefined,
                      }}>
                      {dayjs(ride.dateCreation).format('DD/MM/YYYY')}
                      {'\n\n'}
                      {computePathDistanceKm(position!, ride.destination)} km
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteIcon}
                    onPress={() => {
                      Modal.alert('Confirmation', 'Delete this ride ?', [
                        {text: 'Close'},
                        {
                          text: 'OK',
                          onPress: () => {
                            storeDataRides.delete(ride.id).then(() => {
                              Toast.show({
                                type: 'success',
                                text1: 'DELETE',
                                text2: 'Ride has been deleted !',
                              });
                              setSelectedRideData(
                                selectedRideData.filter(
                                  selected => selected.id !== ride.id,
                                ),
                              );
                            });
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
      {editingRideData && editingRideData.name && (
        <View>
          <FloatingAction
            overrideWithAction
            showBackground={false}
            actions={[
              {
                name: 'rides_management_save',
                icon: <Icon name="save" size={25} color={'white'} />,
              },
            ]}
            onPressItem={() =>
              storeDataRides.update(editingRideData).then(() => {
                Toast.show({
                  type: 'success',
                  text1: 'UPDATE',
                  text2: 'Ride has been saved !',
                });
                setEditingRideData(null);
                setSelectedRideData([]);
              })
            }
          />
        </View>
      )}
      {editingRideData && !!selectedRideData.length && (
        <View>
          <FloatingAction
            overrideWithAction
            showBackground={false}
            position="left"
            actions={[
              {
                name: 'rides_management_delete_all',
                icon: <Icon name="trash-o" size={25} color={'white'} />,
              },
            ]}
            onPressItem={async () => {
              Modal.alert(
                'Confirmation',
                'Are you sure you want to delete all those rides ?',
                [
                  {text: 'Close'},
                  {
                    text: 'OK',
                    onPress: async () => {
                      await DataStore.doFetch(
                        `${URL_BACKEND}/${API_PREFIX}/${API_RIDES}/all`,
                        url =>
                          fetch(url, {
                            method: 'DELETE',
                            body: JSON.stringify(
                              selectedRideData.map(selected => selected.id),
                            ),
                            headers: {
                              'Content-Type': 'application/json',
                            },
                          }),
                      );
                      Toast.show({
                        type: 'success',
                        text1: 'UPDATE',
                        text2: 'Rides have been deleted !',
                      });
                      storeDataRides.data = new Set(
                        [...storeDataRides.data!].filter(
                          snapshotRide =>
                            !selectedRideData.some(
                              selected => snapshotRide.id === selected.id,
                            ),
                        ),
                      );
                      storeDataRides.notify();
                      setEditingRideData(null);
                      setSelectedRideData([]);
                    },
                  },
                ],
              );
            }}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 50,
    marginTop: 35,
    marginLeft: 10,
    marginBottom: 15,
    color: 'black',
  },
  subtitle: {
    fontSize: 15,
    marginLeft: 12.5,
    marginBottom: 25,
  },
  searchContainer: {
    marginBottom: 10,
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

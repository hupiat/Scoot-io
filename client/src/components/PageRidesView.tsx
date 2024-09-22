import {ActivityIndicator, List, Modal, View} from '@ant-design/react-native';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useStoreDataRides} from '../commons/middleware/hooks';
import {Ride} from '../commons/types';
import dayjs from 'dayjs';
import {useRideContext} from '../commons/rides/context';
import Icon from 'react-native-vector-icons/FontAwesome';
import {fetchGeocodeRouting} from '../commons/middleware/tools';
import Toast from 'react-native-toast-message';

export default function PageRidesView() {
  const [ridesData, storeDataRides] = useStoreDataRides();
  const {setDestination, position, setDestinationName, setRideGeometry} =
    useRideContext();

  if (!ridesData) {
    return (
      <ActivityIndicator
        size={'large'}
        color={'blue'}
        styles={{
          spinner: styles.indicator,
        }}
      />
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <Text style={styles.title}>Rides Management</Text>
      {ridesData.length ? (
        <List>
          {ridesData.map(ride => (
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
                      );
                      setRideGeometry(coords);
                      setDestination(ride.destination);
                      setDestinationName(ride.name);
                    },
                  },
                ]);
              }}>
              <List.Item>
                <View>
                  {ride.name} ({dayjs(ride.dateCreation).format('DD/MM/YYYY')})
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
                  <Icon name="trash-o" size={30} />
                </TouchableOpacity>
              </List.Item>
            </TouchableOpacity>
          ))}
        </List>
      ) : (
        <>
          <Text style={styles.emptyMessage}>No data have been found :-(</Text>
          <Text style={styles.emptyMessage}>Start riding !</Text>
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

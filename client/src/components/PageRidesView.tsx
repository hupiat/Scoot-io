import {List, Modal, View} from '@ant-design/react-native';
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useStoreDataRides} from '../commons/middleware/hooks';
import {Ride} from '../commons/types';
import dayjs from 'dayjs';
import {useRideContext} from '../commons/rides/context';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function PageRidesView() {
  const [data, setData] = useState<Ride[]>([]);
  const [, storeDataRides] = useStoreDataRides();
  const {setDestination} = useRideContext();

  useEffect(() => {
    storeDataRides
      .fetchAll()
      .then(() => setData(Array.from(storeDataRides.data!)));
  }, []);

  return (
    <View>
      <Text style={styles.title}>Rides Management</Text>
      <ScrollView
        style={styles.scrollView}
        automaticallyAdjustContentInsets={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        {data.length ? (
          <List>
            {data?.map(ride => (
              <TouchableOpacity
                key={ride.id}
                onPress={() => {
                  Modal.alert('Confirmation', 'Start this ride ?', [
                    {text: 'Cancel', onPress: () => {}, style: 'cancel'},
                    {
                      text: 'OK',
                      onPress: () => setDestination(ride.destination),
                    },
                  ]);
                }}>
                <List.Item>
                  {ride.name} {dayjs(ride.dateCreation).format('DD/MM/YYYY')}{' '}
                  <TouchableOpacity
                    onPress={() => {
                      Modal.alert('Confirmation', 'Delete this ride ?', [
                        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
                        {
                          text: 'OK',
                          onPress: () => storeDataRides.delete(ride.id),
                        },
                      ]);
                    }}>
                    <Icon name="delete" />
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
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 50,
    marginTop: 35,
    marginLeft: 10,
  },
  emptyMessage: {
    fontSize: 25,
    marginTop: 55,
    marginLeft: 10,
  },
  scrollView: {
    flex: 1,
    marginTop: 20,
  },
});

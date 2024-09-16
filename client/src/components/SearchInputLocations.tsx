import React, {useDeferredValue, useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AutocompleteInput from 'react-native-autocomplete-input';
import DataStore from '../commons/middleware/DataStore';
import {
  API_GOOGLE_PLACES,
  API_GOOGLE_PLACES_FIND,
} from '../commons/middleware/paths';
import {GOOGLE_WEB_API_KEY} from '../commons/_local_constants';
import {Place} from '../commons/types';
import {Input} from '@ant-design/react-native';

interface IProps {
  onSelectPlace: (place: Place) => void;
}

export default function SearchInputLocations({onSelectPlace}: IProps) {
  const [query, setQuery] = useState<string>('');
  const [data, setData] = useState<[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    DataStore.doFetch(
      API_GOOGLE_PLACES +
        'input=' +
        deferredQuery +
        '&key=' +
        GOOGLE_WEB_API_KEY,
      async url => await fetch(url),
    )
      .then(res => res?.json())
      .then(json => setData(json.predictions));
  }, [deferredQuery]);

  const handleSelect = (item: any) => {
    DataStore.doFetch(
      API_GOOGLE_PLACES_FIND +
        'input=' +
        item.description +
        '&fields=formatted_address,name,geometry&inputtype=textquery&key=' +
        GOOGLE_WEB_API_KEY,
      async url => await fetch(url),
    )
      .then(res => res?.json())
      .then(json => {
        // should always be present
        const jsonPlace = json.candidates[0];
        setSelectedPlace({
          name: jsonPlace.name,
          geometry: {
            latitude: jsonPlace.geometry.location.lat,
            longitude: jsonPlace.geometry.location.lng,
          },
          address: jsonPlace.formatted_address,
        });
        setQuery(jsonPlace.formatted_address);
      });
  };

  useEffect(() => {
    if (selectedPlace) {
      onSelectPlace(selectedPlace);
    }
  }, [selectedPlace]);

  return (
    <SafeAreaView style={styles.autocompleteContainer}>
      <AutocompleteInput
        data={data}
        value={query}
        containerStyle={styles.autocompleteContainer}
        inputContainerStyle={styles.autocompleteContainer}
        onChangeText={setQuery}
        flatListProps={{
          keyExtractor: (_, i: number) => String(i),
          renderItem: ({item}: {item: any}) => (
            <TouchableOpacity onPress={() => handleSelect(item)}>
              <Text>{item.description}</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
    width: '100%',
  },
});

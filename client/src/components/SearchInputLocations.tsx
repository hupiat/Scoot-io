import React, {useDeferredValue, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import AutocompleteInput from 'react-native-autocomplete-input';
import DataStore from '../commons/middleware/DataStore';
import {API_NOMINATIM, API_PROXY} from '../commons/middleware/paths';
import {Place} from '../commons/types';

interface IProps {
  onSelectPlace: (place: Place) => void;
  hideResults: boolean;
}

export default function SearchInputLocations({
  onSelectPlace,
  hideResults,
}: IProps) {
  const [query, setQuery] = useState<string>('');
  const [data, setData] = useState<[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    DataStore.doFetch(
      API_PROXY + API_NOMINATIM + 'format=json&q=' + deferredQuery,
      async url =>
        await fetch(url, {
          headers: {
            'User-Agent': 'Scootio/1.0 (hugopiatlillo@gmail.com)',
          },
        }),
    )
      .then(res => res?.json())
      .then(json => setData(json));
  }, [deferredQuery]);

  const handleSelect = (item: any) => {
    setSelectedPlace({
      name: item.name,
      address: item.display_name,
      geometry: {
        latitude: item.lat,
        longitude: item.lon,
      },
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
        hideResults={hideResults}
        containerStyle={styles.autocompleteContainer}
        inputContainerStyle={styles.autocompleteContainer}
        onChangeText={setQuery}
        flatListProps={{
          keyExtractor: item => item.place_id,
          renderItem: ({item}: {item: any}) => (
            <TouchableOpacity
              onPress={() => handleSelect(item)}
              style={styles.autoCompleteItem}>
              <Text>{item.display_name}</Text>
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
  autoCompleteItem: {
    height: 50,
  },
});

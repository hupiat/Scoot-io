import React, {useDeferredValue, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import AutocompleteInput from 'react-native-autocomplete-input';
import DataStore from '../commons/middleware/DataStore';
import {Place} from '../commons/types';
import {API_MAPBOX} from '../commons/middleware/paths';
import {MAPBOX_WEB_APi_KEY} from '../commons/_local_constants';

interface IProps {
  onSelectPlace: (place: Place) => void;
  hideResults?: boolean;
  forceDisplay?: string;
}

export default function SearchInputLocations({
  onSelectPlace,
  hideResults,
  forceDisplay,
}: IProps) {
  const [query, setQuery] = useState<string>('');
  const [data, setData] = useState<[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    DataStore.doFetch(
      API_MAPBOX + deferredQuery + '.json?access_token=' + MAPBOX_WEB_APi_KEY,
      async url => await fetch(url),
    )
      .then(res => res?.json())
      .then(json => setData(json.features));
  }, [deferredQuery]);

  const handleSelect = (item: any) => {
    setQuery(item.place_name);
    setSelectedPlace({
      name: item.text,
      address: item.place_name,
      geometry: {
        longitude: item.center[0],
        latitude: item.center[1],
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
        value={query || forceDisplay}
        hideResults={hideResults}
        containerStyle={styles.autocompleteContainer}
        inputContainerStyle={styles.autocompleteContainer}
        onChangeText={setQuery}
        flatListProps={{
          keyExtractor: item => item.id,
          renderItem: ({item}: {item: any}) => (
            <TouchableOpacity
              onPress={() => handleSelect(item)}
              style={styles.autoCompleteItem}>
              <Text>{item.place_name}</Text>
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

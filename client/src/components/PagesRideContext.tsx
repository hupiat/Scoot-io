import {TabBar} from '@ant-design/react-native';
import React, {useState, useTransition} from 'react';
import {StyleSheet, View} from 'react-native';
import PageProfileView from './PageProfileView';
import PageRidesView from './PageRidesView';
import PageRoadlineView from './PageRoadlineView';
import {useRideContext} from '../commons/rides/context';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  COLOR_DARK_MODE_PRIMARY,
  COLOR_PRIMARY,
  useDarkModeContext,
} from '../commons/DarkModeContext';

export default function PagesRideContext() {
  const [, startTransition] = useTransition();
  const [tab, setTab] = useState<number>(1);
  const {destination} = useRideContext();
  const {isDarkMode} = useDarkModeContext();

  const getIconColor = (index: number) => {
    if (tab === index) {
      return COLOR_PRIMARY;
    }
    if (isDarkMode) {
      return 'white';
    }
  };

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: isDarkMode ? COLOR_DARK_MODE_PRIMARY : undefined,
      }}>
      {tab === 0 && <PageRidesView />}
      {tab === 1 && <PageRoadlineView />}
      {tab === 2 && <PageProfileView />}
      <View>
        <TabBar
          barTintColor={isDarkMode ? COLOR_DARK_MODE_PRIMARY : undefined}
          unselectedTintColor={isDarkMode ? 'white' : undefined}>
          <TabBar.Item
            title="Stored rides"
            icon={<Icon name="dashboard" size={20} color={getIconColor(0)} />}
            selected={tab === 0}
            onPress={() => startTransition(() => setTab(0))}
          />
          <TabBar.Item
            icon={<Icon name="map" size={20} color={getIconColor(1)} />}
            title="Ride"
            selected={tab === 1}
            badge={!!destination ? 'pending' : undefined}
            onPress={() => startTransition(() => setTab(1))}
          />
          <TabBar.Item
            icon={<Icon name="eye" size={20} color={getIconColor(2)} />}
            title="Profile"
            selected={tab === 2}
            onPress={() => startTransition(() => setTab(2))}
          />
        </TabBar>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'space-between',
  },
});

import {TabBar, Icon} from '@ant-design/react-native';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import PageProfileView from './PageProfileView';
import PageRidesView from './PageRidesView';
import PageRoadlineView from './PageRoadlineView';
import {useRideContext} from '../commons/rides/context';

export default function PagesRideContext() {
  const [tab, setTab] = useState<number>(1);
  const {destination} = useRideContext();

  return (
    <View style={styles.container}>
      {tab === 0 && <PageRidesView />}
      {tab === 1 && <PageRoadlineView />}
      {tab === 2 && <PageProfileView />}
      <View>
        <TabBar>
          <TabBar.Item
            title="Stored rides"
            icon={<Icon name="dashboard" />}
            selected={tab === 0}
            onPress={() => setTab(0)}
          />
          <TabBar.Item
            icon={<Icon name="branches" />}
            title="Ride"
            selected={tab === 1}
            badge={!!destination ? 'pending' : undefined}
            onPress={() => setTab(1)}
          />
          <TabBar.Item
            icon={<Icon name="eye" />}
            title="Profile"
            selected={tab === 2}
            onPress={() => setTab(2)}
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

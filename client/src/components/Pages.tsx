import React, {useState} from 'react';
import {useMiddlewareContext} from '../commons/middleware/context';
import PageLogin from './PageLogin';
import PageRoadlineView from './PageRoadlineView';
import {TabBar, Icon, Text, View} from '@ant-design/react-native';
import {StyleSheet} from 'react-native';

export default function Pages() {
  const [tab, setTab] = useState<number>(1);
  const {user} = useMiddlewareContext();

  return (
    <>
      {!user && <PageLogin />}
      {user && (
        <View style={styles.container}>
          {tab === 0 && <PageRoadlineView />}
          {tab === 1 && <PageRoadlineView />}
          {tab === 2 && <PageRoadlineView />}
          <View>
            <TabBar>
              <TabBar.Item
                title="Stored rides"
                icon={<Icon name="database" />}
                selected={tab === 0}
                onPress={() => setTab(0)}
              />
              <TabBar.Item
                icon={<Icon name="branches" />}
                title="Ride"
                selected={tab === 1}
                badge={'pending'}
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
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 0.935,
    justifyContent: 'space-between',
  },
});

import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import DataStore from './DataStore';
import {
  Account,
  BusinessObject,
  ChargingStation,
  Marker,
  Ride,
  WorkflowStep,
} from '../types';
import Toast from 'react-native-toast-message';
import {
  API_ACCOUNTS,
  API_CHARGING_STATIONS,
  API_MARKERS,
  API_PREFIX,
  API_RIDES,
  URL_BACKEND,
} from './paths';
import {useRideContext} from '../rides/context';

export type StoreSnapshot<T extends BusinessObject> = [
  Array<T> | null,
  DataStore<T>,
];

// Initialization (synchro to API, data fetch)

const useStoreData = <T extends BusinessObject>(
  store: DataStore<T>,
  fetchAll: boolean,
  longitude?: number,
  latitude?: number,
): T[] | null => {
  const [data, setData] = useState<T[] | null>(null);

  const getSnapshot = () => data;

  return useSyncExternalStore<T[] | null>(
    onStoreChange => {
      const suscriber = (newData: Set<T>) => {
        if (
          !data ||
          newData.size !== data.length ||
          !data.every(item => newData.has(item))
        ) {
          onStoreChange();
          setData(Array.from(newData));
        }
      };

      const init = async () => {
        // Queries implemented in DataStore.ts
        store.subscribe(suscriber);

        // Fetching base data (getAll)
        if (!store.isSync() && store.hasAPI()) {
          if (fetchAll) {
            await store.fetchAll(longitude, latitude);
          } else {
            store.emptySynchronize();
          }
        }
      };

      init();

      return () => store.unsubscribe(suscriber);
    },
    getSnapshot,
    getSnapshot,
  );
};

// Creation

const useStoreDataCreate = <T extends BusinessObject>(
  path: string,
  fetchAll: boolean = true,
  longitude?: number,
  latitude?: number,
): StoreSnapshot<T> => {
  // This one is most generic tho, and can be overrided easily
  // by more relevant workflow
  function logInfo<T extends BusinessObject>(op: WorkflowStep, obj: T) {
    Toast.show({
      type: 'success',
      text1: op.toLocaleUpperCase(),
      text2: 'Data has been updated in database',
    });
  }

  // This one is great, and could be even more generic in details message,
  // but still errors should not happen in production, we let them as an "error code"
  // for the users
  const logError = (details: Error) => {
    Toast.show({
      type: 'error',
      text1: 'ERROR WHILE UPDATING DATABASE',
      text2: details.message,
    });
  };

  const store = useRef<DataStore<T>>(
    new DataStore<T>(path, logError, logInfo, URL_BACKEND + '/' + API_PREFIX),
  );

  useEffect(() => {
    store.current.formatUrlThenSet(path, URL_BACKEND + '/' + API_PREFIX);
  }, [path]);

  const data = useStoreData(store.current, fetchAll, longitude, latitude);
  return [data, store.current];
};

// Business

export const useStoreDataAccounts = (): StoreSnapshot<Account> =>
  useStoreDataCreate<Account>(API_ACCOUNTS, false);

export const useStoreDataRides = (): StoreSnapshot<Ride> =>
  useStoreDataCreate<Ride>(API_RIDES);

export const useStoreDataMarkers = (): StoreSnapshot<Marker> => {
  const {position} = useRideContext();
  return useStoreDataCreate<Marker>(
    API_MARKERS,
    true,
    position?.longitude,
    position?.latitude,
  );
};

export const useStoreDataChargingStations =
  (): StoreSnapshot<ChargingStation> => {
    const {position} = useRideContext();
    return useStoreDataCreate<ChargingStation>(
      API_CHARGING_STATIONS,
      true,
      position?.longitude,
      position?.latitude,
    );
  };

import {useDeferredValue, useEffect, useRef, useSyncExternalStore} from 'react';
import DataStore from './DataStore';
import {Account, BusinessObject, Marker, Ride, WorkflowStep} from '../types';
import Toast from 'react-native-toast-message';
import {
  API_ACCOUNTS,
  API_MARKERS,
  API_PREFIX,
  API_RIDES,
  URL_BACKEND,
} from './paths';

export type StoreSnapshot<T extends BusinessObject> = [
  Array<T> | null,
  DataStore<T>,
];

// Initialization (synchro to API, data fetch)

const useStoreData = <T extends BusinessObject>(
  store: DataStore<T>,
  fetchAll: boolean,
): T[] | null => {
  const storeDataDeferred = useDeferredValue(
    store.isSync() ? [...store.data!] : null,
  );

  return useSyncExternalStore<T[] | null>(
    onStoreChange => {
      const suscriber = (data: Set<T>) => {
        onStoreChange();
      };

      const init = async () => {
        // Fetching base data (getAll)
        if (!store.isSync() && store.hasAPI()) {
          if (fetchAll) {
            await store.fetchAll();
          } else {
            store.emptySynchronize();
          }
        }

        // Then suscribing changes
        // Queries implemented in DataStore.ts
        // Need to stay in this closure
        store.subscribe(suscriber);
      };

      init();

      return () => store.unsubscribe(suscriber);
    },
    () => storeDataDeferred,
    () => storeDataDeferred,
  );
};

// Creation

const useStoreDataCreate = <T extends BusinessObject>(
  path: string,
  fetchAll: boolean = true,
): StoreSnapshot<T> => {
  // This one is most generic tho, and can be overrided easily
  // by more relevant workflow
  function logInfo<T extends BusinessObject>(op: WorkflowStep, obj: T) {
    Toast.show({
      type: 'success',
      text1: op.toLocaleUpperCase(),
      text2: 'Object has been updated in database',
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

  const data = useStoreData(store.current, fetchAll);
  return [data, store.current];
};

// Business

export const useStoreDataAccounts = (): StoreSnapshot<Account> =>
  useStoreDataCreate<Account>(API_ACCOUNTS, false);

export const useStoreDataRides = (): StoreSnapshot<Ride> =>
  useStoreDataCreate<Ride>(API_RIDES);

export const useStoreDataMarkers = (): StoreSnapshot<Marker> =>
  useStoreDataCreate<Marker>(API_MARKERS);

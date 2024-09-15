
import {
    useDeferredValue,
    useEffect,
    useRef,
    useState,
    useSyncExternalStore,
  } from "react";
  import DataStore from "./DataStore";
  import {
      Account,
    BusinessObject,
    WorkflowStep,
  } from "../types";
  
  type StoreSnapshot<T extends BusinessObject> = [Array<T> | null, DataStore<T>];
  
  // Initialization (synchro to API, data fetch)
  
  const useStoreData = <T extends BusinessObject>(
    store: DataStore<T>,
    fetchAll: boolean
  ): T[] | null => {
    const [data, setData] = useState<T[] | null>(null);
    const dataDeferred = useDeferredValue(data);
    const storeDataDeferred = useDeferredValue(
      store.isSync() ? [...store.data!] : null
    );
  
    return useSyncExternalStore<T[] | null>(
      (onStoreChange) => {
        const suscriber = (data: Set<T>) => {
          setData([...data]);
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
      () => dataDeferred,
      () => storeDataDeferred
    );
  };
  
  // Creation
  
  const useStoreDataCreate = <T extends BusinessObject>(
    path: string,
    fetchAll: boolean = true
  ): StoreSnapshot<T> => {
  
    // TODO : toasts
  
    const store = useRef<DataStore<T>>(
      new DataStore<T>(
        path,
        () => {},
        () => {},
        API_PREFIX
      )
    );
  
    useEffect(() => {
      store.current.formatUrlThenSet(path, API_PREFIX);
    }, [path]);
  
    const data = useStoreData(store.current, fetchAll);
    return [data, store.current];
  };
  
  // Business
  
  export const useStoreDataAccounts = (): StoreSnapshot<Account> =>
    useStoreDataCreate<Account>(API_ACCOUNTS, false);
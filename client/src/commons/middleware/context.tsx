import React, {useTransition, useState} from 'react';
import {useContext} from 'react';
import {Account, ContextChildren} from '../../commons/types';
import DataStore from './DataStore';
import {displayErrorToast} from '../tools';
import {API_ACCOUNTS, API_PREFIX, URL_BACKEND} from './paths';
import {useStoreDataAccounts} from './hooks';
import Toast from 'react-native-toast-message';

interface IMiddlewareContext {
  user: Account | null;
  setUser: (user: Account | null) => Promise<void | boolean>;
  // Note this datastore should always be fetched from context for
  // performances concern
  storeDataAccounts: DataStore<Account>;
}

const SetupMiddlewareContext = React.createContext<
  IMiddlewareContext | undefined
>(undefined);

interface IProps {
  children?: ContextChildren;
}

const MiddlewareContext = ({children}: IProps) => {
  const [user, setUserState] = useState<Account | null>(null);
  const [pendingUserTransition, startUserTransition] = useTransition();

  // Init data stores static logs
  const [, storeDataAccounts] = useStoreDataAccounts();

  // State reducer (login + logout)
  const setUser = async (user: Account | null): Promise<void | boolean> => {
    if (!user) {
      startUserTransition(() => {
        DataStore.doFetch(
          `${URL_BACKEND}/${API_PREFIX}/${API_ACCOUNTS}/logout`,
          async url =>
            await fetch(url, {
              method: 'DELETE',
            }),
        )
          .then(() => {
            setUserState(user);
            Toast.show({
              type: 'info',
              text1: 'Logout',
              text2: 'You have been logged out',
            });
          })
          .catch(displayErrorToast);
      });
    } else {
      startUserTransition(() => {
        DataStore.doFetch(
          `${URL_BACKEND}/${API_PREFIX}/${API_ACCOUNTS}/login`,
          async url =>
            await fetch(url, {
              method: 'POST',
              body: JSON.stringify({
                email: user.email,
                password: user.password,
              }),
              headers: {
                'Content-Type': 'application/json',
              },
            }),
        )
          .then(async res => {
            if (res!.status == 404) {
              throw Error('Bad credentials');
            } else {
              Toast.show({
                type: 'info',
                text1: 'Login',
                text2: 'You have been logged',
              });
              return await res!.json();
            }
          })
          .then(json => setUserState(json))
          .catch(displayErrorToast);
      });
    }
    return pendingUserTransition;
  };

  return (
    <SetupMiddlewareContext.Provider
      value={{
        user,
        setUser,
        storeDataAccounts,
      }}>
      {children}
    </SetupMiddlewareContext.Provider>
  );
};

export const useMiddlewareContext = (): IMiddlewareContext => {
  const context = useContext(SetupMiddlewareContext);
  if (!context) {
    throw Error('Context is not mounted');
  }
  return context;
};

export default MiddlewareContext;

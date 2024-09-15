import React, {useTransition, useState} from 'react';
import {useContext} from 'react';
import {Account, ContextChildren} from '../../commons/types';
import DataStore from './DataStore';
import {displayErrorToast} from '../tools';
import {API_ACCOUNTS, API_PREFIX, URL_BACKEND} from './paths';
import {StoreSnapshot, useStoreDataAccounts} from './hooks';

interface IMiddlewareContext {
  user: Account | null;
  setUser: (user: Account | null) => Promise<void | boolean>;
  // Note this datastore should always be fetched from context for
  // performances concern
  storeDataAccounts: StoreSnapshot<Account>;
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
  const storeDataAccounts = useStoreDataAccounts();

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
            }),
        )
          .then(async res => {
            if (res!.status == 404) {
              throw Error('Bad credentials');
            } else {
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

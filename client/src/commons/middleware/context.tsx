import React, {useState, Dispatch, SetStateAction} from 'react';
import {useContext} from 'react';
import {Account, ContextChildren} from '../../commons/types';
import DataStore from './DataStore';
import {displayErrorToast, removeToken, storeToken} from '../tools';
import {API_ACCOUNTS, API_PREFIX, URL_BACKEND} from './paths';
import {useStoreDataAccounts} from './hooks';
import Toast from 'react-native-toast-message';

interface IMiddlewareContext {
  user: Account | null;
  setUser: (user: Account | null) => Promise<void>;
  setUserState: Dispatch<SetStateAction<Account | null>>;
  shouldSaveToken: boolean;
  setShouldSaveToken: Dispatch<SetStateAction<boolean>>;
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
  const [shouldSaveToken, setShouldSaveToken] = useState<boolean>(true);
  const [user, setUserState] = useState<Account | null>(null);

  // Init data stores static logs
  const [, storeDataAccounts] = useStoreDataAccounts();

  // State reducer (login + logout)
  const setUser = async (user: Account | null): Promise<void> => {
    if (!user) {
      DataStore.doFetch(
        `${URL_BACKEND}/${API_PREFIX}/${API_ACCOUNTS}/logout`,
        url =>
          fetch(url, {
            method: 'DELETE',
          }),
      )
        .then(async res => {
          const json = (await res?.json()) as Account;
          removeToken();
          storeToken(json.username, json.token!);
          setUserState(user);
          Toast.show({
            type: 'info',
            text1: 'LOGOUT',
            text2: 'You have been logged out',
          });
        })
        .catch(displayErrorToast);
    } else {
      DataStore.doFetch(
        `${URL_BACKEND}/${API_PREFIX}/${API_ACCOUNTS}/login`,
        url =>
          fetch(url, {
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
              text1: 'LOGIN',
              text2: 'You have been logged',
            });
            return await res!.json();
          }
        })
        .then(json => setUserState(json))
        .catch(() =>
          displayErrorToast({
            name: 'Error',
            message: 'Bad credentials',
          }),
        );
    }
  };

  return (
    <SetupMiddlewareContext.Provider
      value={{
        user,
        setUser,
        setUserState,
        storeDataAccounts,
        setShouldSaveToken,
        shouldSaveToken,
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

import React, { useTransition, useState } from "react";
import { useContext } from "react";
import {
  Account,
  ContextChildren,
} from "../../commons/types";
import DataStore from "./DataStore";

interface IMiddlewareContext {
  user: Account | null;
  setUser: (user: Account | null) => Promise<void | boolean>;
}

const SetupMiddlewareContext = React.createContext<
  IMiddlewareContext | undefined
>(undefined);

interface IProps {
  children?: ContextChildren;
}

const SESSION_STORAGE_USER = "user_storage";

const MiddlewareContext = ({ children }: IProps) => {
  const [user, setUserState] = useState<Account | null>(null);
  const [pendingLogout, startLogout] = useTransition();

  // State reducer (local storage + logout)
  const setUser = async (user: Account | null): Promise<void | boolean> => {
    if (!user) {
      startLogout(() => {
        DataStore.doFetch(
          API_PREFIX + API_ACCOUNTS + "/logout",
          async (url) =>
            await fetch(url, {
              method: "DELETE",
            })
        )
          .then(() => {
            setUserState(user);
            localStorage.removeItem(SESSION_STORAGE_USER);
          })
          // .catch(() => toasterErrorLogout.toast("Internal error"));
      });
      return pendingLogout;
    } else {
      localStorage.setItem(SESSION_STORAGE_USER, JSON.stringify(user));
      setUserState(user);
    }
  };

  // Init state from local storage
  if (!user) {
    let storage = localStorage.getItem(SESSION_STORAGE_USER);
    if (!!storage) {
      storage = JSON.parse(storage);
      setUserState(storage as any as Account);
    }
  }

  return (
    <SetupMiddlewareContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </SetupMiddlewareContext.Provider>
  );
};

export const useMiddlewareContext = (): IMiddlewareContext => {
  const context = useContext(SetupMiddlewareContext);
  if (!context) {
    throw Error("Context is not mounted");
  }
  return context;
};

export default MiddlewareContext;
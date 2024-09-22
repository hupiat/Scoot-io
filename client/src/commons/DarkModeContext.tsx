import React, {Dispatch, SetStateAction, useState} from 'react';
import {useContext} from 'react';
import {ContextChildren} from './types';
import {Appearance} from 'react-native';

// should be nice in dark and light mode
export const COLOR_PRIMARY = '#01579B';

export const COLOR_DARK_MODE_PRIMARY = '#263238';

interface IDarkModeContext {
  isDarkMode: boolean;
  setIsDarkMode: Dispatch<SetStateAction<boolean>>;
}

const SetupDarkModeContext = React.createContext<IDarkModeContext | undefined>(
  undefined,
);

interface IProps {
  children?: ContextChildren;
}

const DarkModeContext = ({children}: IProps) => {
  const colorScheme = Appearance.getColorScheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(colorScheme === 'dark');

  return (
    <SetupDarkModeContext.Provider
      value={{
        isDarkMode,
        setIsDarkMode,
      }}>
      {children}
    </SetupDarkModeContext.Provider>
  );
};

export const useDarkModeContext = (): IDarkModeContext => {
  const context = useContext(SetupDarkModeContext);
  if (!context) {
    throw Error('Context is not mounted');
  }
  return context;
};

export default DarkModeContext;

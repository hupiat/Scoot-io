import React from 'react';
import {useContext} from 'react';
import {ContextChildren} from '../../commons/types';

interface IRideContext {}

const SetupRideContext = React.createContext<IRideContext | undefined>(
  undefined,
);

interface IProps {
  children?: ContextChildren;
}

const RideContext = ({children}: IProps) => {
  return (
    <SetupRideContext.Provider value={{}}>{children}</SetupRideContext.Provider>
  );
};

export const useRideContext = (): IRideContext => {
  const context = useContext(SetupRideContext);
  if (!context) {
    throw Error('Context is not mounted');
  }
  return context;
};

export default RideContext;

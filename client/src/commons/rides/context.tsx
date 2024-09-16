import React, {Dispatch, SetStateAction, useState} from 'react';
import {useContext} from 'react';
import {ContextChildren, GeoCode} from '../../commons/types';

interface IRideContext {
  destination: GeoCode | null;
  setDestination: Dispatch<SetStateAction<GeoCode | null>>;
}

const SetupRideContext = React.createContext<IRideContext | undefined>(
  undefined,
);

interface IProps {
  children?: ContextChildren;
}

const RideContext = ({children}: IProps) => {
  const [destination, setDestination] = useState<GeoCode | null>(null);

  return (
    <SetupRideContext.Provider value={{destination, setDestination}}>
      {children}
    </SetupRideContext.Provider>
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

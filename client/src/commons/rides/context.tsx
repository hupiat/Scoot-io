import React, {Dispatch, SetStateAction, useState} from 'react';
import {useContext} from 'react';
import {ContextChildren, GeoCode} from '../../commons/types';
import {Region} from 'react-native-maps';

interface IRideContext {
  destination: GeoCode | null;
  setDestination: Dispatch<SetStateAction<GeoCode | null>>;
  region: Region | undefined;
  setRegion: Dispatch<SetStateAction<Region | undefined>>;
}

const SetupRideContext = React.createContext<IRideContext | undefined>(
  undefined,
);

interface IProps {
  children?: ContextChildren;
}

const RideContext = ({children}: IProps) => {
  const [region, setRegion] = useState<Region>();
  const [destination, setDestination] = useState<GeoCode | null>(null);

  return (
    <SetupRideContext.Provider
      value={{destination, setDestination, region, setRegion}}>
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

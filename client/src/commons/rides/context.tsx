import React, {Dispatch, SetStateAction, useState} from 'react';
import {useContext} from 'react';
import {ContextChildren, GeoCode, SecurityLevel} from '../../commons/types';

interface IRideContext {
  position: GeoCode | undefined;
  setPosition: Dispatch<SetStateAction<GeoCode | undefined>>;
  destination: GeoCode | null;
  setDestination: Dispatch<SetStateAction<GeoCode | null>>;
  destinationName: string | null;
  setDestinationName: Dispatch<SetStateAction<string | null>>;
  rideGeometry: GeoCode[] | null;
  setRideGeometry: Dispatch<SetStateAction<GeoCode[] | null>>;
  securityLevel: SecurityLevel;
  setSecurityLevel: Dispatch<SetStateAction<SecurityLevel>>;
}

const SetupRideContext = React.createContext<IRideContext | undefined>(
  undefined,
);

interface IProps {
  children?: ContextChildren;
}

const RideContext = ({children}: IProps) => {
  const [position, setPosition] = useState<GeoCode>();
  const [securityLevel, setSecurityLevel] = useState<SecurityLevel>('cycling');
  const [destinationName, setDestinationName] = useState<string | null>(null);
  const [destination, setDestination] = useState<GeoCode | null>(null);
  const [rideGeometry, setRideGeometry] = useState<GeoCode[] | null>(null);

  return (
    <SetupRideContext.Provider
      value={{
        position,
        setPosition,
        destination,
        setDestination,
        rideGeometry,
        setRideGeometry,
        destinationName,
        setDestinationName,
        securityLevel,
        setSecurityLevel,
      }}>
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

import {OPEN_CHARGE_MAP_API_KEY} from '../_local_constants';
import {ChargingStation, GeoCode} from '../types';
import DataStore from './DataStore';
import {API_OPEN_CHARGE_MAP, API_OSRM} from './paths';

export const LOCAL_SEARCH_CHARGING_STATIONS_RADIUS_KM = 25;

const EPSILON = 1e-4;
export const areCoordinatesEqual = (
  geometry: GeoCode,
  geometry2: GeoCode,
): boolean => {
  return (
    Math.abs(geometry.latitude - geometry2.latitude) < EPSILON &&
    Math.abs(geometry.longitude - geometry2.longitude) < EPSILON
  );
};

export const fetchGeocodeRouting = async (
  position: GeoCode,
  destination: GeoCode,
): Promise<GeoCode[]> => {
  return new Promise((resolve, reject) => {
    let coords: GeoCode[] = [];
    DataStore.doFetch(
      API_OSRM +
        position.longitude +
        ',' +
        position.latitude +
        ';' +
        destination.longitude +
        ',' +
        destination.latitude +
        '?steps=true',
      url => fetch(url),
    )
      .then(res => res?.json())
      .then(jsons => {
        for (const route of jsons.routes) {
          for (const leg of route.legs) {
            for (const step of leg.steps) {
              coords = [
                ...coords,
                ...step.intersections.map((json: any) => ({
                  longitude: json.location[0],
                  latitude: json.location[1],
                })),
              ];
            }
          }
        }
        resolve(coords);
      })
      .catch(reject);
  });
};

export const fetchChargingStations = (
  position: GeoCode,
  radiusKm: number,
): Promise<ChargingStation[]> => {
  return new Promise((resolve, reject) => {
    let stations: ChargingStation[] = [];
    DataStore.doFetch(
      `${API_OPEN_CHARGE_MAP}?key=${OPEN_CHARGE_MAP_API_KEY}&distanceunit=km&distance=${radiusKm}&longitude=${position.longitude}&latitude=${position.latitude}`,
      url => fetch(url),
    )
      .then(res => res?.json())
      .then(jsons => {
        for (const json of jsons) {
          stations = [
            ...stations,
            {
              id: json.AddressInfo.Id,
              dateCreation: json.DateLastConfirmed,
              name: json.AddressInfo.Title,
              geometry: {
                longitude: json.AddressInfo.Longitude,
                latitude: json.AddressInfo.Latitude,
              },
            },
          ];
        }
        resolve(stations);
      })
      .catch(reject);
  });
};

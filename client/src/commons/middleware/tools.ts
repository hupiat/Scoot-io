import {MAPBOX_WEB_APi_KEY, OPEN_CHARGE_MAP_API_KEY} from '../_local_constants';
import {ChargingStation, GeoCode, SecurityLevel} from '../types';
import DataStore from './DataStore';
import {API_MAPBOX_DIRECTIONS, API_OPEN_CHARGE_MAP} from './paths';

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

export const computePathDistanceKm = (position: GeoCode, other: GeoCode) => {
  const EARTH_RADIUS_KM = 6371;

  const toRadians = (degree: number) => degree * (Math.PI / 180);

  const lon1Rad = toRadians(position.longitude);
  const lat1Rad = toRadians(position.latitude);
  const lon2Rad = toRadians(other.longitude);
  const lat2Rad = toRadians(other.latitude);

  const deltaLat = lat2Rad - lat1Rad;
  const deltaLon = lon2Rad - lon1Rad;

  // Haversine formula
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Path distance computation
  const distance = EARTH_RADIUS_KM * c;

  return distance.toFixed(3);
};

export const fetchGeocodeRouting = async (
  position: GeoCode,
  destination: GeoCode,
  securityLevel: SecurityLevel,
): Promise<GeoCode[]> => {
  return new Promise((resolve, reject) => {
    let coords: GeoCode[] = [];
    DataStore.doFetch(
      API_MAPBOX_DIRECTIONS +
        securityLevel +
        '/' +
        position.longitude +
        ',' +
        position.latitude +
        ';' +
        destination.longitude +
        ',' +
        destination.latitude +
        '?steps=true&access_token=' +
        MAPBOX_WEB_APi_KEY,
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
              id: json.ID,
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

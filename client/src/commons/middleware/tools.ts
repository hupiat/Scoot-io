import {MAPBOX_WEB_APi_KEY, OPEN_CHARGE_MAP_API_KEY} from '../_local_constants';
import {ChargingStation, GeoCode, SecurityLevel} from '../types';
import DataStore from './DataStore';
import {API_MAPBOX_DIRECTIONS, API_OPEN_CHARGE_MAP} from './paths';

// Should probably stay the same than markers fetching in server-side ?
export const LOCAL_SEARCH_CHARGING_STATIONS_RADIUS_KM = 25;

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

import {GeoCode} from '../types';
import DataStore from './DataStore';
import {API_OSRM} from './paths';

export const fetchGeocodeRouting = async (
  positionLong: number,
  positionLat: number,
  destLong: number,
  destLat: number,
): Promise<GeoCode[]> => {
  return new Promise((resolve, reject) => {
    let coords: GeoCode[] = [];
    DataStore.doFetch(
      API_OSRM +
        positionLong +
        ',' +
        positionLat +
        ';' +
        destLong +
        ',' +
        destLat +
        '?steps=true&geometries=polyline',
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

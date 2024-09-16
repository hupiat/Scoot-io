// --------------------------------------
// TECHNICAL
// --------------------------------------

export type ContextChildren =
  | JSX.Element
  | JSX.Element[]
  | Array<JSX.Element | undefined>;

export type WorkflowStep = 'read' | 'add' | 'edit' | 'delete';

export type ResponseType = 'json' | 'text' | 'blob';

// --------------------------------------
// BUSINESS
// --------------------------------------

export type GeoCode = {
  latitude: number;
  longitude: number;
};

export interface Place {
  name: string;
  address: string;
  geometry: GeoCode;
}

export interface BusinessObject {
  id: number;
  dateCreation: Date;
}

export interface Account extends BusinessObject {
  email: string;
  username: string;
  picture?: string;
  // Will not be present from fetching, even encrypted
  password?: string;
}

export interface Ride extends BusinessObject {
  name: string;
  destination: GeoCode;
}

// -----------------------------------------------------
// OTHERS (utilities)
// -----------------------------------------------------

export type WithoutId<T extends BusinessObject> = Omit<
  Omit<T, 'dateCreation'>,
  'id'
> &
  Partial<Pick<T, 'id'>> &
  Partial<Pick<T, 'dateCreation'>>;

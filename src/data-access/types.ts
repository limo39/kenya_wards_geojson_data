/**
 * Core data types for Kenya geospatial data
 */

export interface Point {
  latitude: number;
  longitude: number;
}

export interface BoundingBox {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export interface Ward {
  id: string;
  name: string;
  countyId: string;
  countyName: string;
  constituencyId: string;
  constituencyName: string;
  subCountyId: string;
  subCountyName: string;
  geometry: GeoJSON;
}

export interface County {
  id: string;
  name: string;
  wardCount: number;
}

export interface Constituency {
  id: string;
  name: string;
  countyId: string;
  wardCount: number;
}

export interface SubCounty {
  id: string;
  name: string;
  countyId: string;
  wardCount: number;
}

export interface GeoJSON {
  type: 'MultiPolygon' | 'Polygon';
  coordinates: number[][][];
}

export interface QueryResult<T> {
  data: T[];
  count: number;
  error?: string;
}

export interface IDataAccess {
  // Ward queries
  findWardByPoint(point: Point): Promise<Ward | null>;
  findNearestWard(point: Point, limit?: number): Promise<Ward[]>;
  findWardsWithinDistance(point: Point, distanceKm: number): Promise<Ward[]>;
  findWardsByCounty(countyName: string): Promise<Ward[]>;
  findWardsInBoundingBox(bbox: BoundingBox): Promise<Ward[]>;
  findWardByName(name: string): Promise<Ward | null>;

  // County queries
  getAllCounties(): Promise<County[]>;
  getCountyByName(name: string): Promise<County | null>;

  // Constituency queries
  getConstituenciesByCounty(countyName: string): Promise<Constituency[]>;

  // Sub-county queries
  getSubCountiesByCounty(countyName: string): Promise<SubCounty[]>;

  // Statistics
  getStatistics(): Promise<{
    totalWards: number;
    totalCounties: number;
    totalConstituencies: number;
  }>;
}

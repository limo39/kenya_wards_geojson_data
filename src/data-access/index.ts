/**
 * Unified data access layer for Kenya geospatial data
 * Provides a clean API for querying wards, counties, and constituencies
 */

export type { Ward, County, Constituency, SubCounty, Point, BoundingBox } from './types';
export { DataAccessFactory } from './factory';
export { PostgresDataAccess } from './postgres';
export { SqliteDataAccess } from './sqlite';

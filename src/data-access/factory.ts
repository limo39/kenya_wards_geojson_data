/**
 * Factory for creating data access instances
 * Supports both PostgreSQL and SQLite backends
 */

import type { IDataAccess } from './types';

export type DatabaseType = 'postgres' | 'sqlite';

export class DataAccessFactory {
  static async create(type: DatabaseType): Promise<IDataAccess> {
    if (type === 'postgres') {
      const { PostgresDataAccess } = await import('./postgres');
      return new PostgresDataAccess();
    } else if (type === 'sqlite') {
      const { SqliteDataAccess } = await import('./sqlite');
      return new SqliteDataAccess();
    }
    throw new Error(`Unsupported database type: ${type}`);
  }

  static createSync(type: DatabaseType): IDataAccess {
    if (type === 'postgres') {
      const { PostgresDataAccess } = require('./postgres');
      return new PostgresDataAccess();
    } else if (type === 'sqlite') {
      const { SqliteDataAccess } = require('./sqlite');
      return new SqliteDataAccess();
    }
    throw new Error(`Unsupported database type: ${type}`);
  }
}

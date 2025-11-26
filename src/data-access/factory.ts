/**
 * Factory for creating data access instances
 * Supports PostgreSQL, SQLite, and Mock backends
 */

import type { IDataAccess } from './types';
import { MockDataAccess } from './mock';
import { PostgresDataAccess } from './postgres';
import { SqliteDataAccess } from './sqlite';

export type DatabaseType = 'postgres' | 'sqlite' | 'mock';

export class DataAccessFactory {
  static async create(type: DatabaseType): Promise<IDataAccess> {
    if (type === 'postgres') {
      return new PostgresDataAccess();
    } else if (type === 'sqlite') {
      return new SqliteDataAccess();
    } else if (type === 'mock') {
      return new MockDataAccess();
    }
    throw new Error(`Unsupported database type: ${type}`);
  }

  static createSync(type: DatabaseType): IDataAccess {
    if (type === 'postgres') {
      return new PostgresDataAccess();
    } else if (type === 'sqlite') {
      return new SqliteDataAccess();
    } else if (type === 'mock') {
      return new MockDataAccess();
    }
    throw new Error(`Unsupported database type: ${type}`);
  }
}

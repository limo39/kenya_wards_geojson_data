/**
 * Factory for creating analytics instances
 */

import type { IDataAccess } from '../data-access/types';
import { Analytics } from './analytics';
import type { IAnalytics } from './types';

export class AnalyticsFactory {
  static create(dataAccess: IDataAccess): IAnalytics {
    return new Analytics(dataAccess);
  }
}

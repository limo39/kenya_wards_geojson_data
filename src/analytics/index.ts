/**
 * Analytics module for Kenya geospatial data
 * Provides insights, aggregations, and statistical analysis
 */

export type {
  AnalyticsMetrics,
  CountyAnalytics,
  ConstituencyAnalytics,
  SpatialDistribution,
  DensityAnalytics,
  BoundaryAnalytics,
  AnalyticsReport,
} from './types';

export { Analytics } from './analytics';
export { AnalyticsFactory } from './factory';
export { Reporter } from './reporting';
export { AnalyticsQueries } from './queries';

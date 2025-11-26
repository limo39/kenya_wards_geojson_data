/**
 * Analytics data types
 */

export interface AnalyticsMetrics {
  totalWards: number;
  totalCounties: number;
  totalConstituencies: number;
  totalSubCounties: number;
  averageWardsPerCounty: number;
  averageWardsPerConstituency: number;
  largestCounty: {
    name: string;
    wardCount: number;
  };
  smallestCounty: {
    name: string;
    wardCount: number;
  };
}

export interface CountyAnalytics {
  countyName: string;
  wardCount: number;
  constituencyCount: number;
  subCountyCount: number;
  percentageOfTotalWards: number;
  averageWardArea?: number;
  boundingBox?: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
}

export interface ConstituencyAnalytics {
  constituencyName: string;
  countyName: string;
  wardCount: number;
  subCountyCount: number;
  percentageOfCountyWards: number;
}

export interface SpatialDistribution {
  region: string;
  wardCount: number;
  coordinates: {
    centerLat: number;
    centerLng: number;
  };
  spread: {
    latRange: number;
    lngRange: number;
  };
}

export interface DensityAnalytics {
  region: string;
  wardDensity: number; // wards per 1000 sq km
  area?: number; // sq km
  wardCount: number;
}

export interface BoundaryAnalytics {
  wardName: string;
  countyName: string;
  constituencyName: string;
  boundingBox: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
  area?: number; // sq km
  perimeter?: number; // km
  complexity: 'simple' | 'moderate' | 'complex'; // based on polygon vertices
}

export interface AnalyticsReport {
  generatedAt: Date;
  metrics: AnalyticsMetrics;
  countyBreakdown: CountyAnalytics[];
  topCountiesByWards: CountyAnalytics[];
  spatialDistribution: SpatialDistribution[];
  densityAnalysis: DensityAnalytics[];
}

export interface IAnalytics {
  // Overview metrics
  getMetrics(): Promise<AnalyticsMetrics>;

  // County-level analytics
  getCountyAnalytics(countyName: string): Promise<CountyAnalytics>;
  getAllCountyAnalytics(): Promise<CountyAnalytics[]>;
  getTopCountiesByWards(limit?: number): Promise<CountyAnalytics[]>;

  // Constituency-level analytics
  getConstituencyAnalytics(constituencyName: string): Promise<ConstituencyAnalytics>;
  getConstituenciesByCounty(countyName: string): Promise<ConstituencyAnalytics[]>;

  // Spatial analysis
  getSpatialDistribution(region?: string): Promise<SpatialDistribution[]>;
  getDensityAnalysis(region?: string): Promise<DensityAnalytics[]>;

  // Boundary analysis
  getBoundaryAnalytics(wardName: string): Promise<BoundaryAnalytics>;
  getComplexBoundaries(threshold?: number): Promise<BoundaryAnalytics[]>;

  // Comprehensive report
  generateReport(): Promise<AnalyticsReport>;

  // Comparison queries
  compareCounties(county1: string, county2: string): Promise<{
    county1: CountyAnalytics;
    county2: CountyAnalytics;
    difference: {
      wardDifference: number;
      percentageDifference: number;
    };
  }>;

  // Search and filter
  findWardsInRange(
    minWards: number,
    maxWards: number
  ): Promise<{ region: string; wardCount: number }[]>;
}

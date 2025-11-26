/**
 * Core analytics implementation
 * Provides statistical analysis and insights from geospatial data
 */

import type { IDataAccess } from '../data-access/types';
import type {
  IAnalytics,
  AnalyticsMetrics,
  CountyAnalytics,
  ConstituencyAnalytics,
  SpatialDistribution,
  DensityAnalytics,
  BoundaryAnalytics,
  AnalyticsReport,
} from './types';

export class Analytics implements IAnalytics {
  constructor(private dataAccess: IDataAccess) {}

  async getMetrics(): Promise<AnalyticsMetrics> {
    const stats = await this.dataAccess.getStatistics();
    const counties = await this.dataAccess.getAllCounties();

    const sortedByWards = [...counties].sort((a, b) => b.wardCount - a.wardCount);

    return {
      totalWards: stats.totalWards,
      totalCounties: stats.totalCounties,
      totalConstituencies: stats.totalConstituencies,
      totalSubCounties: 0, // To be calculated from data
      averageWardsPerCounty: Math.round(stats.totalWards / stats.totalCounties),
      averageWardsPerConstituency: Math.round(
        stats.totalWards / stats.totalConstituencies
      ),
      largestCounty: {
        name: sortedByWards[0]?.name || 'N/A',
        wardCount: sortedByWards[0]?.wardCount || 0,
      },
      smallestCounty: {
        name: sortedByWards[sortedByWards.length - 1]?.name || 'N/A',
        wardCount: sortedByWards[sortedByWards.length - 1]?.wardCount || 0,
      },
    };
  }

  async getCountyAnalytics(countyName: string): Promise<CountyAnalytics> {
    const county = await this.dataAccess.getCountyByName(countyName);
    if (!county) throw new Error(`County not found: ${countyName}`);

    const stats = await this.dataAccess.getStatistics();
    const constituencies = await this.dataAccess.getConstituenciesByCounty(countyName);
    const subCounties = await this.dataAccess.getSubCountiesByCounty(countyName);

    return {
      countyName: county.name,
      wardCount: county.wardCount,
      constituencyCount: constituencies.length,
      subCountyCount: subCounties.length,
      percentageOfTotalWards: (county.wardCount / stats.totalWards) * 100,
    };
  }

  async getAllCountyAnalytics(): Promise<CountyAnalytics[]> {
    const counties = await this.dataAccess.getAllCounties();
    const stats = await this.dataAccess.getStatistics();

    return Promise.all(
      counties.map(async (county) => {
        const constituencies = await this.dataAccess.getConstituenciesByCounty(
          county.name
        );
        const subCounties = await this.dataAccess.getSubCountiesByCounty(county.name);

        return {
          countyName: county.name,
          wardCount: county.wardCount,
          constituencyCount: constituencies.length,
          subCountyCount: subCounties.length,
          percentageOfTotalWards: (county.wardCount / stats.totalWards) * 100,
        };
      })
    );
  }

  async getTopCountiesByWards(limit: number = 10): Promise<CountyAnalytics[]> {
    const allAnalytics = await this.getAllCountyAnalytics();
    return allAnalytics.sort((a, b) => b.wardCount - a.wardCount).slice(0, limit);
  }

  async getConstituencyAnalytics(constituencyName: string): Promise<ConstituencyAnalytics> {
    // Implementation would query specific constituency
    throw new Error('Not implemented');
  }

  async getConstituenciesByCounty(countyName: string): Promise<ConstituencyAnalytics[]> {
    const constituencies = await this.dataAccess.getConstituenciesByCounty(countyName);
    const stats = await this.dataAccess.getStatistics();
    const county = await this.dataAccess.getCountyByName(countyName);

    if (!county) throw new Error(`County not found: ${countyName}`);

    return constituencies.map((c) => ({
      constituencyName: c.name,
      countyName,
      wardCount: c.wardCount,
      subCountyCount: 0, // To be calculated
      percentageOfCountyWards: (c.wardCount / county.wardCount) * 100,
    }));
  }

  async getSpatialDistribution(region?: string): Promise<SpatialDistribution[]> {
    // Implementation would calculate center points and spread
    throw new Error('Not implemented');
  }

  async getDensityAnalysis(region?: string): Promise<DensityAnalytics[]> {
    // Implementation would calculate ward density per area
    throw new Error('Not implemented');
  }

  async getBoundaryAnalytics(wardName: string): Promise<BoundaryAnalytics> {
    const ward = await this.dataAccess.findWardByName(wardName);
    if (!ward) throw new Error(`Ward not found: ${wardName}`);

    // Calculate complexity based on geometry vertices
    const geometry = ward.geometry;
    let vertexCount = 0;

    if (geometry.type === 'MultiPolygon') {
      geometry.coordinates.forEach((polygon) => {
        polygon.forEach((ring) => {
          vertexCount += ring.length;
        });
      });
    } else if (geometry.type === 'Polygon') {
      geometry.coordinates.forEach((ring) => {
        vertexCount += ring.length;
      });
    }

    const complexity =
      vertexCount < 50 ? 'simple' : vertexCount < 200 ? 'moderate' : 'complex';

    return {
      wardName: ward.name,
      countyName: ward.countyName,
      constituencyName: ward.constituencyName,
      boundingBox: {
        minLat: 0,
        maxLat: 0,
        minLng: 0,
        maxLng: 0,
      },
      complexity,
    };
  }

  async getComplexBoundaries(threshold: number = 200): Promise<BoundaryAnalytics[]> {
    // Implementation would find boundaries with high vertex count
    throw new Error('Not implemented');
  }

  async generateReport(): Promise<AnalyticsReport> {
    const metrics = await this.getMetrics();
    const countyBreakdown = await this.getAllCountyAnalytics();
    const topCounties = await this.getTopCountiesByWards(10);

    return {
      generatedAt: new Date(),
      metrics,
      countyBreakdown,
      topCountiesByWards: topCounties,
      spatialDistribution: [],
      densityAnalysis: [],
    };
  }

  async compareCounties(
    county1: string,
    county2: string
  ): Promise<{
    county1: CountyAnalytics;
    county2: CountyAnalytics;
    difference: {
      wardDifference: number;
      percentageDifference: number;
    };
  }> {
    const c1 = await this.getCountyAnalytics(county1);
    const c2 = await this.getCountyAnalytics(county2);

    const wardDifference = c1.wardCount - c2.wardCount;
    const percentageDifference = ((wardDifference / c2.wardCount) * 100) | 0;

    return {
      county1: c1,
      county2: c2,
      difference: {
        wardDifference,
        percentageDifference,
      },
    };
  }

  async findWardsInRange(
    minWards: number,
    maxWards: number
  ): Promise<{ region: string; wardCount: number }[]> {
    const counties = await this.dataAccess.getAllCounties();
    return counties
      .filter((c) => c.wardCount >= minWards && c.wardCount <= maxWards)
      .map((c) => ({
        region: c.name,
        wardCount: c.wardCount,
      }));
  }
}

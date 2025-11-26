/**
 * Pre-built analytics queries for common use cases
 * Provides quick access to frequently needed insights
 */

import type { IAnalytics } from './types';
import { Reporter } from './reporting';

export class AnalyticsQueries {
  constructor(private analytics: IAnalytics) {}

  /**
   * Get executive summary
   */
  async executiveSummary(): Promise<string> {
    const metrics = await this.analytics.getMetrics();
    return Reporter.formatMetrics(metrics);
  }

  /**
   * Get top performers
   */
  async topPerformers(limit: number = 10): Promise<string> {
    const topCounties = await this.analytics.getTopCountiesByWards(limit);
    return Reporter.formatCountyTable(topCounties);
  }

  /**
   * Get distribution analysis
   */
  async distributionAnalysis(): Promise<string> {
    const allCounties = await this.analytics.getAllCountyAnalytics();
    return Reporter.generateDistributionSummary(allCounties);
  }

  /**
   * Get counties by size category
   */
  async countiesBySize(): Promise<{
    large: { region: string; wardCount: number }[];
    medium: { region: string; wardCount: number }[];
    small: { region: string; wardCount: number }[];
  }> {
    const large = await this.analytics.findWardsInRange(50, 1000);
    const medium = await this.analytics.findWardsInRange(20, 49);
    const small = await this.analytics.findWardsInRange(1, 19);

    return { large, medium, small };
  }

  /**
   * Get regional breakdown
   */
  async regionalBreakdown(): Promise<string> {
    const allCounties = await this.analytics.getAllCountyAnalytics();
    return Reporter.formatCountyTable(allCounties);
  }

  /**
   * Export all analytics as JSON
   */
  async exportAsJSON(): Promise<string> {
    const report = await this.analytics.generateReport();
    return Reporter.generateJSON(report);
  }

  /**
   * Export county data as CSV
   */
  async exportCountiesAsCSV(): Promise<string> {
    const counties = await this.analytics.getAllCountyAnalytics();
    return Reporter.generateCountyCSV(counties);
  }

  /**
   * Get quick stats for a county
   */
  async countyQuickStats(countyName: string): Promise<string> {
    const analytics = await this.analytics.getCountyAnalytics(countyName);
    const constituencies = await this.analytics.getConstituenciesByCounty(countyName);

    return `
=== ${analytics.countyName.toUpperCase()} ===

Wards: ${analytics.wardCount}
Constituencies: ${analytics.constituencyCount}
Sub-counties: ${analytics.subCountyCount}
Percentage of Total Wards: ${analytics.percentageOfTotalWards.toFixed(2)}%

Constituencies:
${constituencies.map((c) => `  • ${c.constituencyName}: ${c.wardCount} wards`).join('\n')}
    `;
  }

  /**
   * Get variance analysis
   */
  async varianceAnalysis(): Promise<string> {
    const metrics = await this.analytics.getMetrics();
    const allCounties = await this.analytics.getAllCountyAnalytics();

    const wardCounts = allCounties.map((c) => c.wardCount);
    const mean = wardCounts.reduce((a, b) => a + b, 0) / wardCounts.length;
    const variance =
      wardCounts.reduce((sum, count) => sum + Math.pow(count - mean, 2), 0) /
      wardCounts.length;
    const stdDev = Math.sqrt(variance);

    return `
=== VARIANCE ANALYSIS ===

Mean Wards per County: ${mean.toFixed(2)}
Standard Deviation: ${stdDev.toFixed(2)}
Coefficient of Variation: ${((stdDev / mean) * 100).toFixed(2)}%

Interpretation:
${stdDev / mean > 0.5 ? '  • High variation in ward distribution across counties' : '  • Relatively uniform ward distribution'}
${metrics.largestCounty.wardCount / metrics.smallestCounty.wardCount > 5 ? '  • Significant disparity between largest and smallest counties' : '  • Balanced county sizes'}
    `;
  }
}

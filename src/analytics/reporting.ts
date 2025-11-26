/**
 * Reporting utilities for analytics data
 * Formats analytics into human-readable reports and exports
 */

import type {
  AnalyticsMetrics,
  CountyAnalytics,
  AnalyticsReport,
} from './types';

export class Reporter {
  /**
   * Format metrics as a readable summary
   */
  static formatMetrics(metrics: AnalyticsMetrics): string {
    return `
=== KENYA GEOSPATIAL DATA METRICS ===

Total Administrative Divisions:
  • Wards: ${metrics.totalWards}
  • Counties: ${metrics.totalCounties}
  • Constituencies: ${metrics.totalConstituencies}
  • Sub-counties: ${metrics.totalSubCounties}

Averages:
  • Wards per County: ${metrics.averageWardsPerCounty}
  • Wards per Constituency: ${metrics.averageWardsPerConstituency}

Extremes:
  • Largest County: ${metrics.largestCounty.name} (${metrics.largestCounty.wardCount} wards)
  • Smallest County: ${metrics.smallestCounty.name} (${metrics.smallestCounty.wardCount} wards)
    `;
  }

  /**
   * Format county analytics as a table
   */
  static formatCountyTable(counties: CountyAnalytics[]): string {
    const header = 'County'.padEnd(25) + 'Wards'.padEnd(10) + 'Constituencies'.padEnd(15) + '% of Total';
    const separator = '='.repeat(70);

    const rows = counties.map((c) =>
      c.countyName.padEnd(25) +
      c.wardCount.toString().padEnd(10) +
      c.constituencyCount.toString().padEnd(15) +
      c.percentageOfTotalWards.toFixed(2) + '%'
    );

    return [header, separator, ...rows].join('\n');
  }

  /**
   * Generate CSV export for counties
   */
  static generateCountyCSV(counties: CountyAnalytics[]): string {
    const headers = ['County', 'Wards', 'Constituencies', 'Sub-counties', 'Percentage of Total'];
    const rows = counties.map((c) => [
      c.countyName,
      c.wardCount,
      c.constituencyCount,
      c.subCountyCount,
      c.percentageOfTotalWards.toFixed(2),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    return csv;
  }

  /**
   * Generate JSON export
   */
  static generateJSON(data: any): string {
    return JSON.stringify(data, null, 2);
  }

  /**
   * Generate comprehensive text report
   */
  static generateTextReport(report: AnalyticsReport): string {
    const metricsSection = this.formatMetrics(report.metrics);
    const topCountiesSection = `
=== TOP COUNTIES BY WARD COUNT ===

${this.formatCountyTable(report.topCountiesByWards)}
    `;

    const summaryStats = `
=== SUMMARY STATISTICS ===

Total Wards Analyzed: ${report.metrics.totalWards}
Report Generated: ${report.generatedAt.toISOString()}
    `;

    return [metricsSection, topCountiesSection, summaryStats].join('\n');
  }

  /**
   * Generate comparison report
   */
  static generateComparisonReport(
    county1: CountyAnalytics,
    county2: CountyAnalytics,
    difference: { wardDifference: number; percentageDifference: number }
  ): string {
    return `
=== COUNTY COMPARISON ===

${county1.countyName}:
  • Wards: ${county1.wardCount}
  • Constituencies: ${county1.constituencyCount}
  • Percentage of Total: ${county1.percentageOfTotalWards.toFixed(2)}%

${county2.countyName}:
  • Wards: ${county2.wardCount}
  • Constituencies: ${county2.constituencyCount}
  • Percentage of Total: ${county2.percentageOfTotalWards.toFixed(2)}%

Difference:
  • Ward Difference: ${difference.wardDifference > 0 ? '+' : ''}${difference.wardDifference}
  • Percentage Difference: ${difference.percentageDifference > 0 ? '+' : ''}${difference.percentageDifference}%
    `;
  }

  /**
   * Generate distribution summary
   */
  static generateDistributionSummary(counties: CountyAnalytics[]): string {
    const sorted = [...counties].sort((a, b) => b.wardCount - a.wardCount);
    const top5 = sorted.slice(0, 5);
    const bottom5 = sorted.slice(-5).reverse();

    const topSection = `
=== TOP 5 COUNTIES ===
${top5.map((c, i) => `${i + 1}. ${c.countyName}: ${c.wardCount} wards`).join('\n')}
    `;

    const bottomSection = `
=== BOTTOM 5 COUNTIES ===
${bottom5.map((c, i) => `${i + 1}. ${c.countyName}: ${c.wardCount} wards`).join('\n')}
    `;

    return [topSection, bottomSection].join('\n');
  }
}

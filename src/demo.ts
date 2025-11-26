/**
 * Demo script showing analytics in action
 * Run with: npx ts-node src/demo.ts
 */

import { DataAccessFactory } from './data-access';
import { AnalyticsFactory, AnalyticsQueries, Reporter } from './analytics';

async function main() {
  try {
    console.log('🚀 Kenya Geospatial Analytics Demo\n');

    // Initialize with mock data
    console.log('📊 Initializing data access layer...');
    const db = DataAccessFactory.createSync('mock');
    const analytics = AnalyticsFactory.create(db);
    const queries = new AnalyticsQueries(analytics);

    // 1. Executive Summary
    console.log('\n' + '='.repeat(60));
    console.log('1. EXECUTIVE SUMMARY');
    console.log('='.repeat(60));
    const summary = await queries.executiveSummary();
    console.log(summary);

    // 2. Top Counties
    console.log('\n' + '='.repeat(60));
    console.log('2. TOP 10 COUNTIES BY WARD COUNT');
    console.log('='.repeat(60));
    const topCounties = await queries.topPerformers(10);
    console.log(topCounties);

    // 3. Distribution Analysis
    console.log('\n' + '='.repeat(60));
    console.log('3. DISTRIBUTION ANALYSIS');
    console.log('='.repeat(60));
    const distribution = await queries.distributionAnalysis();
    console.log(distribution);

    // 4. County Size Categories
    console.log('\n' + '='.repeat(60));
    console.log('4. COUNTIES BY SIZE CATEGORY');
    console.log('='.repeat(60));
    const sizes = await queries.countiesBySize();
    console.log(`\n📈 Large Counties (50+ wards): ${sizes.large.length}`);
    sizes.large.slice(0, 3).forEach((c) => {
      console.log(`   • ${c.region}: ${c.wardCount} wards`);
    });

    console.log(`\n📊 Medium Counties (20-49 wards): ${sizes.medium.length}`);
    sizes.medium.slice(0, 3).forEach((c) => {
      console.log(`   • ${c.region}: ${c.wardCount} wards`);
    });

    console.log(`\n📉 Small Counties (1-19 wards): ${sizes.small.length}`);
    sizes.small.slice(0, 3).forEach((c) => {
      console.log(`   • ${c.region}: ${c.wardCount} wards`);
    });

    // 5. Variance Analysis
    console.log('\n' + '='.repeat(60));
    console.log('5. VARIANCE ANALYSIS');
    console.log('='.repeat(60));
    const variance = await queries.varianceAnalysis();
    console.log(variance);

    // 6. Specific County Analysis
    console.log('\n' + '='.repeat(60));
    console.log('6. COUNTY DEEP DIVE: NAIROBI');
    console.log('='.repeat(60));
    try {
      const nairobiStats = await queries.countyQuickStats('Nairobi');
      console.log(nairobiStats);
    } catch (e) {
      console.log('⚠️  Nairobi data not available (database not populated)');
    }

    // 7. County Comparison
    console.log('\n' + '='.repeat(60));
    console.log('7. COUNTY COMPARISON');
    console.log('='.repeat(60));
    try {
      const comparison = await analytics.compareCounties('Nairobi', 'Mombasa');
      const report = Reporter.generateComparisonReport(
        comparison.county1,
        comparison.county2,
        comparison.difference
      );
      console.log(report);
    } catch (e) {
      console.log('⚠️  Comparison data not available (database not populated)');
    }

    // 8. Export Options
    console.log('\n' + '='.repeat(60));
    console.log('8. EXPORT OPTIONS');
    console.log('='.repeat(60));
    console.log('✅ Available exports:');
    console.log('   • JSON: await queries.exportAsJSON()');
    console.log('   • CSV:  await queries.exportCountiesAsCSV()');
    console.log('   • Text: await queries.executiveSummary()');

    console.log('\n✨ Demo completed successfully!\n');
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();

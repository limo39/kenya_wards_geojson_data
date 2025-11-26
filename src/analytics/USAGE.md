# Analytics Usage Guide

Complete guide to using the analytics module for Kenya geospatial data.

## Setup

```typescript
import { DataAccessFactory } from '../data-access';
import { AnalyticsFactory, AnalyticsQueries, Reporter } from './analytics';

const db = DataAccessFactory.createSync('postgres');
const analytics = AnalyticsFactory.create(db);
const queries = new AnalyticsQueries(analytics);
```

## Common Queries

### 1. Executive Summary

Get high-level overview of all data:

```typescript
const summary = await queries.executiveSummary();
console.log(summary);
```

Output:
```
=== KENYA GEOSPATIAL DATA METRICS ===

Total Administrative Divisions:
  • Wards: 1450
  • Counties: 47
  • Constituencies: 290
  • Sub-counties: 200

Averages:
  • Wards per County: 30.85
  • Wards per Constituency: 5.0

Extremes:
  • Largest County: Nairobi (85 wards)
  • Smallest County: Lamu (6 wards)
```

### 2. Top Performers

Find counties with most wards:

```typescript
const top = await queries.topPerformers(5);
console.log(top);
```

### 3. Distribution Analysis

Understand how wards are distributed:

```typescript
const distribution = await queries.distributionAnalysis();
console.log(distribution);
```

### 4. County Size Categories

Categorize counties by ward count:

```typescript
const sizes = await queries.countiesBySize();
console.log(`Large counties: ${sizes.large.length}`);
console.log(`Medium counties: ${sizes.medium.length}`);
console.log(`Small counties: ${sizes.small.length}`);
```

### 5. Specific County Analysis

Deep dive into a single county:

```typescript
const nairobiStats = await queries.countyQuickStats('Nairobi');
console.log(nairobiStats);
```

### 6. County Comparison

Compare two counties side-by-side:

```typescript
const comparison = await analytics.compareCounties('Nairobi', 'Mombasa');
console.log(`Nairobi: ${comparison.county1.wardCount} wards`);
console.log(`Mombasa: ${comparison.county2.wardCount} wards`);
console.log(`Difference: ${comparison.difference.wardDifference} wards`);
```

### 7. Variance Analysis

Understand distribution uniformity:

```typescript
const variance = await queries.varianceAnalysis();
console.log(variance);
```

### 8. Export Data

Export analytics in various formats:

```typescript
// Export as JSON
const jsonReport = await queries.exportAsJSON();
fs.writeFileSync('report.json', jsonReport);

// Export counties as CSV
const csvData = await queries.exportCountiesAsCSV();
fs.writeFileSync('counties.csv', csvData);
```

## Advanced Analytics

### Find Regions by Ward Count Range

```typescript
// Find counties with 20-50 wards
const mediumCounties = await analytics.findWardsInRange(20, 50);
mediumCounties.forEach(c => {
  console.log(`${c.region}: ${c.wardCount} wards`);
});
```

### Get All County Analytics

```typescript
const allCounties = await analytics.getAllCountyAnalytics();
allCounties.forEach(c => {
  console.log(`${c.countyName}: ${c.wardCount} wards (${c.percentageOfTotalWards.toFixed(2)}%)`);
});
```

### Analyze Constituencies

```typescript
const constituencies = await analytics.getConstituenciesByCounty('Nairobi');
constituencies.forEach(c => {
  console.log(`${c.constituencyName}: ${c.wardCount} wards`);
});
```

## Reporting

### Generate Full Report

```typescript
const report = await analytics.generateReport();
console.log(`Generated at: ${report.generatedAt}`);
console.log(`Total wards: ${report.metrics.totalWards}`);
console.log(`Top county: ${report.topCountiesByWards[0].countyName}`);
```

### Format as Table

```typescript
const counties = await analytics.getAllCountyAnalytics();
const table = Reporter.formatCountyTable(counties);
console.log(table);
```

### Generate Comparison Report

```typescript
const c1 = await analytics.getCountyAnalytics('Nairobi');
const c2 = await analytics.getCountyAnalytics('Mombasa');
const comparison = await analytics.compareCounties('Nairobi', 'Mombasa');

const report = Reporter.generateComparisonReport(
  c1,
  c2,
  comparison.difference
);
console.log(report);
```

## Use Cases

### 1. Electoral Planning
```typescript
// Find constituencies with similar sizes for comparison
const allCounties = await analytics.getAllCountyAnalytics();
const largeCounties = allCounties.filter(c => c.wardCount > 50);
```

### 2. Resource Allocation
```typescript
// Identify high-density areas
const variance = await queries.varianceAnalysis();
// Use to allocate resources proportionally
```

### 3. Administrative Review
```typescript
// Compare administrative divisions
const comparison = await analytics.compareCounties('County1', 'County2');
// Identify imbalances
```

### 4. Data Quality Check
```typescript
// Find complex boundaries that may need validation
const complexBoundaries = await analytics.getComplexBoundaries(200);
```

### 5. Regional Reporting
```typescript
// Generate regional breakdown
const breakdown = await queries.regionalBreakdown();
// Export for stakeholders
```

## Performance Tips

1. **Cache Results**: Store frequently accessed data
```typescript
const cachedMetrics = await analytics.getMetrics();
// Reuse cachedMetrics instead of calling again
```

2. **Batch Operations**: Get all data at once
```typescript
const allAnalytics = await analytics.getAllCountyAnalytics();
// Process locally instead of multiple queries
```

3. **Filter Early**: Use range queries to narrow results
```typescript
const filtered = await analytics.findWardsInRange(20, 50);
// Process smaller dataset
```

## Troubleshooting

### "County not found"
- Verify county name spelling and case
- Use `getAllCounties()` to see available counties

### Missing data in analytics
- Ensure data access layer is properly initialized
- Check database connection

### Slow queries
- Consider caching results
- Use batch operations instead of individual queries

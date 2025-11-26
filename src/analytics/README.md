# Analytics Module

Comprehensive analytics and statistical analysis for Kenya geospatial data.

## Quick Start

```typescript
import { DataAccessFactory } from '../data-access';
import { AnalyticsFactory } from './analytics';

// Initialize data access and analytics
const db = DataAccessFactory.createSync('postgres');
const analytics = AnalyticsFactory.create(db);

// Get overview metrics
const metrics = await analytics.getMetrics();
console.log(`Total wards: ${metrics.totalWards}`);
console.log(`Average wards per county: ${metrics.averageWardsPerCounty}`);

// Analyze specific county
const nairobiAnalytics = await analytics.getCountyAnalytics('Nairobi');
console.log(`Nairobi has ${nairobiAnalytics.wardCount} wards`);

// Get top counties
const topCounties = await analytics.getTopCountiesByWards(5);
topCounties.forEach(c => {
  console.log(`${c.countyName}: ${c.wardCount} wards (${c.percentageOfTotalWards.toFixed(2)}%)`);
});

// Compare two counties
const comparison = await analytics.compareCounties('Nairobi', 'Mombasa');
console.log(`Difference: ${comparison.difference.wardDifference} wards`);

// Find counties with specific ward count range
const mediumCounties = await analytics.findWardsInRange(20, 50);

// Generate comprehensive report
const report = await analytics.generateReport();
```

## API Reference

### Overview Metrics

**`getMetrics()`** - Get high-level statistics
- Total wards, counties, constituencies
- Average wards per administrative division
- Largest and smallest counties

### County Analytics

**`getCountyAnalytics(countyName)`** - Analyze specific county
- Ward count
- Constituency and sub-county breakdown
- Percentage of total wards

**`getAllCountyAnalytics()`** - Get analytics for all counties

**`getTopCountiesByWards(limit?)`** - Rank counties by ward count
- Default limit: 10

### Constituency Analytics

**`getConstituencyAnalytics(constituencyName)`** - Analyze specific constituency

**`getConstituenciesByCounty(countyName)`** - Get all constituencies in a county
- Ward distribution
- Percentage breakdown

### Spatial Analysis

**`getSpatialDistribution(region?)`** - Analyze geographic spread
- Center coordinates
- Latitude/longitude range
- Ward distribution

**`getDensityAnalysis(region?)`** - Calculate ward density
- Wards per 1000 sq km
- Area coverage
- Distribution patterns

### Boundary Analysis

**`getBoundaryAnalytics(wardName)`** - Analyze ward boundaries
- Bounding box
- Complexity classification (simple/moderate/complex)
- Vertex count

**`getComplexBoundaries(threshold?)`** - Find complex boundaries
- Useful for identifying data quality issues
- Default threshold: 200 vertices

### Comparison & Filtering

**`compareCounties(county1, county2)`** - Compare two counties
- Side-by-side metrics
- Difference calculations
- Percentage variance

**`findWardsInRange(minWards, maxWards)`** - Filter by ward count
- Find regions with specific ward counts
- Useful for categorization

### Reports

**`generateReport()`** - Comprehensive analytics report
- All metrics
- County breakdown
- Top performers
- Spatial distribution
- Density analysis

## Data Types

```typescript
interface AnalyticsMetrics {
  totalWards: number;
  totalCounties: number;
  totalConstituencies: number;
  averageWardsPerCounty: number;
  largestCounty: { name: string; wardCount: number };
  smallestCounty: { name: string; wardCount: number };
}

interface CountyAnalytics {
  countyName: string;
  wardCount: number;
  constituencyCount: number;
  percentageOfTotalWards: number;
}

interface AnalyticsReport {
  generatedAt: Date;
  metrics: AnalyticsMetrics;
  countyBreakdown: CountyAnalytics[];
  topCountiesByWards: CountyAnalytics[];
}
```

## Use Cases

1. **Administrative Planning** - Understand ward distribution across regions
2. **Resource Allocation** - Identify areas with high ward density
3. **Electoral Analysis** - Compare constituency sizes and distributions
4. **Data Quality** - Identify complex boundaries that may need validation
5. **Regional Comparison** - Benchmark counties against each other
6. **Trend Analysis** - Track changes in administrative divisions

## Implementation Status

- [x] Overview metrics
- [x] County analytics
- [x] Constituency analytics
- [x] County comparison
- [x] Ward range filtering
- [ ] Spatial distribution (requires geometry calculations)
- [ ] Density analysis (requires area calculations)
- [ ] Boundary analytics (requires geometry processing)
- [ ] Complex boundary detection

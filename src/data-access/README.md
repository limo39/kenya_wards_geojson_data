# Data Access Layer

Clean, unified API for accessing Kenya geospatial data across PostgreSQL and SQLite backends.

## Quick Start

```typescript
import { DataAccessFactory } from './data-access';

// Create a data access instance
const db = DataAccessFactory.createSync('postgres'); // or 'sqlite'

// Find ward by coordinates
const ward = await db.findWardByPoint({
  latitude: -1.2921,
  longitude: 36.8219,
});

// Find nearest wards
const nearby = await db.findNearestWard(
  { latitude: -1.2921, longitude: 36.8219 },
  5 // limit to 5 results
);

// Find wards within distance
const withinRadius = await db.findWardsWithinDistance(
  { latitude: -1.2921, longitude: 36.8219 },
  10 // 10 km radius
);

// Get all counties
const counties = await db.getAllCounties();

// Get constituencies by county
const constituencies = await db.getConstituenciesByCounty('Nairobi');

// Get statistics
const stats = await db.getStatistics();
```

## API Reference

### Ward Queries

- `findWardByPoint(point)` - Find exact ward containing a point
- `findNearestWard(point, limit?)` - Find N closest wards
- `findWardsWithinDistance(point, distanceKm)` - Find wards within radius
- `findWardsByCounty(countyName)` - Get all wards in a county
- `findWardsInBoundingBox(bbox)` - Find wards in rectangular area
- `findWardByName(name)` - Find ward by exact name

### Administrative Queries

- `getAllCounties()` - List all counties
- `getCountyByName(name)` - Get county details
- `getConstituenciesByCounty(countyName)` - List constituencies
- `getSubCountiesByCounty(countyName)` - List sub-counties

### Statistics

- `getStatistics()` - Get total counts

## Types

```typescript
interface Point {
  latitude: number;
  longitude: number;
}

interface BoundingBox {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

interface Ward {
  id: string;
  name: string;
  countyId: string;
  countyName: string;
  constituencyId: string;
  constituencyName: string;
  subCountyId: string;
  subCountyName: string;
  geometry: GeoJSON;
}
```

## Implementation Status

- [ ] PostgreSQL/PostGIS implementation
- [ ] SQLite/SpatiaLite implementation
- [ ] Tests

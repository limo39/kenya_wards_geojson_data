/**
 * Mock data access implementation for testing and demos
 * Uses sample Kenya county data
 */

import type {
  IDataAccess,
  Ward,
  County,
  Constituency,
  SubCounty,
  Point,
  BoundingBox,
} from './types';

const MOCK_COUNTIES: County[] = [
  { id: '1', name: 'Nairobi', wardCount: 85 },
  { id: '2', name: 'Kiambu', wardCount: 58 },
  { id: '3', name: 'Nakuru', wardCount: 47 },
  { id: '4', name: 'Mombasa', wardCount: 42 },
  { id: '5', name: 'Kisii', wardCount: 40 },
  { id: '6', name: 'Nyeri', wardCount: 38 },
  { id: '7', name: 'Machakos', wardCount: 37 },
  { id: '8', name: 'Kajiado', wardCount: 36 },
  { id: '9', name: 'Uasin Gishu', wardCount: 35 },
  { id: '10', name: 'Kericho', wardCount: 34 },
  { id: '11', name: 'Bomet', wardCount: 33 },
  { id: '12', name: 'Muranga', wardCount: 32 },
  { id: '13', name: 'Kilifi', wardCount: 31 },
  { id: '14', name: 'Kwale', wardCount: 30 },
  { id: '15', name: 'Makueni', wardCount: 29 },
  { id: '16', name: 'Laikipia', wardCount: 28 },
  { id: '17', name: 'Isiolo', wardCount: 27 },
  { id: '18', name: 'Samburu', wardCount: 26 },
  { id: '19', name: 'Turkana', wardCount: 25 },
  { id: '20', name: 'West Pokot', wardCount: 24 },
  { id: '21', name: 'Baringo', wardCount: 23 },
  { id: '22', name: 'Elgeyo Marakwet', wardCount: 22 },
  { id: '23', name: 'Nandi', wardCount: 21 },
  { id: '24', name: 'Trans Nzoia', wardCount: 20 },
  { id: '25', name: 'Bungoma', wardCount: 19 },
  { id: '26', name: 'Busia', wardCount: 18 },
  { id: '27', name: 'Siaya', wardCount: 17 },
  { id: '28', name: 'Kisumu', wardCount: 16 },
  { id: '29', name: 'Homa Bay', wardCount: 15 },
  { id: '30', name: 'Migori', wardCount: 14 },
  { id: '31', name: 'Nyamira', wardCount: 13 },
  { id: '32', name: 'Narok', wardCount: 12 },
  { id: '33', name: 'Wajir', wardCount: 11 },
  { id: '34', name: 'Mandera', wardCount: 10 },
  { id: '35', name: 'Garissa', wardCount: 9 },
  { id: '36', name: 'Tana River', wardCount: 8 },
  { id: '37', name: 'Taita Taveta', wardCount: 7 },
  { id: '38', name: 'Lamu', wardCount: 6 },
  { id: '39', name: 'Embu', wardCount: 28 },
  { id: '40', name: 'Tharaka Nithi', wardCount: 27 },
  { id: '41', name: 'Meru', wardCount: 26 },
  { id: '42', name: 'Imenti North', wardCount: 25 },
  { id: '43', name: 'Imenti Central', wardCount: 24 },
  { id: '44', name: 'Imenti South', wardCount: 23 },
  { id: '45', name: 'Igembe South', wardCount: 22 },
  { id: '46', name: 'Igembe Central', wardCount: 21 },
  { id: '47', name: 'Igembe North', wardCount: 20 },
];

const MOCK_CONSTITUENCIES: Constituency[] = [
  { id: '1', name: 'Westlands', countyId: '1', wardCount: 8 },
  { id: '2', name: 'Dagoretti North', countyId: '1', wardCount: 7 },
  { id: '3', name: 'Dagoretti South', countyId: '1', wardCount: 7 },
  { id: '4', name: 'Langata', countyId: '1', wardCount: 8 },
  { id: '5', name: 'Kibra', countyId: '1', wardCount: 8 },
  { id: '6', name: 'Kambiokeji', countyId: '1', wardCount: 8 },
  { id: '7', name: 'Embakasi East', countyId: '1', wardCount: 8 },
  { id: '8', name: 'Embakasi Central', countyId: '1', wardCount: 8 },
  { id: '9', name: 'Embakasi South', countyId: '1', wardCount: 8 },
  { id: '10', name: 'Embakasi North', countyId: '1', wardCount: 8 },
  { id: '11', name: 'Makadara', countyId: '1', wardCount: 8 },
  { id: '12', name: 'Kamukunji', countyId: '1', wardCount: 8 },
];

export class MockDataAccess implements IDataAccess {
  async findWardByPoint(point: Point): Promise<Ward | null> {
    return null;
  }

  async findNearestWard(point: Point, limit: number = 1): Promise<Ward[]> {
    return [];
  }

  async findWardsWithinDistance(point: Point, distanceKm: number): Promise<Ward[]> {
    return [];
  }

  async findWardsByCounty(countyName: string): Promise<Ward[]> {
    return [];
  }

  async findWardsInBoundingBox(bbox: BoundingBox): Promise<Ward[]> {
    return [];
  }

  async findWardByName(name: string): Promise<Ward | null> {
    return null;
  }

  async getAllCounties(): Promise<County[]> {
    return MOCK_COUNTIES;
  }

  async getCountyByName(name: string): Promise<County | null> {
    return MOCK_COUNTIES.find((c) => c.name.toLowerCase() === name.toLowerCase()) || null;
  }

  async getConstituenciesByCounty(countyName: string): Promise<Constituency[]> {
    return MOCK_CONSTITUENCIES.filter(
      (c) =>
        MOCK_COUNTIES.find((county) => county.id === c.countyId)?.name.toLowerCase() ===
        countyName.toLowerCase()
    );
  }

  async getSubCountiesByCounty(countyName: string): Promise<SubCounty[]> {
    const county = await this.getCountyByName(countyName);
    if (!county) return [];

    return [
      {
        id: '1',
        name: `${countyName} Sub-county 1`,
        countyId: county.id,
        wardCount: Math.floor(county.wardCount / 2),
      },
      {
        id: '2',
        name: `${countyName} Sub-county 2`,
        countyId: county.id,
        wardCount: Math.ceil(county.wardCount / 2),
      },
    ];
  }

  async getStatistics(): Promise<{
    totalWards: number;
    totalCounties: number;
    totalConstituencies: number;
  }> {
    const totalWards = MOCK_COUNTIES.reduce((sum, c) => sum + c.wardCount, 0);
    return {
      totalWards,
      totalCounties: MOCK_COUNTIES.length,
      totalConstituencies: MOCK_CONSTITUENCIES.length,
    };
  }
}

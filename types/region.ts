export type RegionType = 'city' | 'neighborhood' | 'borough' | 'special';

export interface GeoJSONPolygon {
  type: 'Polygon';
  coordinates: number[][][];
}

export interface Region {
  id: string;
  name: string;
  slug: string;
  type: RegionType;
  parentId: string | null;
  bounds: GeoJSONPolygon | null;
  createdAt: string;
}

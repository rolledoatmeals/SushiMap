export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type DayHours = {
  open: string; // "HH:MM" 24h
  close: string; // "HH:MM" 24h — "00:00" means midnight
  closed: boolean;
};

export type WeeklyHours = {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
};

export type PriceRange = '$' | '$$' | '$$$';

export type Market = 'NYC' | 'NJ' | 'Tampa';

export type RatingValue = 1 | 2 | 3 | 4 | 5;

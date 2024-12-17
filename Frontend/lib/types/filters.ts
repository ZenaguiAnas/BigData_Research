export interface FilterValues {
  year: string;
  month: string;
  country: string;
}

export type FilterKey = keyof FilterValues;

export interface FilterOption {
  value: string;
  label: string;
}
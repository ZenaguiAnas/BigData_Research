'use client';

import { useState, useEffect } from 'react';
import { MONTHS } from '@/lib/constants';
import { fetchData } from '@/lib/api/fetchers';
import { endpoints } from '@/lib/api/endpoints';
import type { FilterOption } from '@/lib/types/filters';

export function useFilterOptions() {
  const [yearOptions, setYearOptions] = useState<FilterOption[]>([
    { value: 'all', label: 'All Years' },
  ]);
  
  const [countryOptions, setCountryOptions] = useState<FilterOption[]>([
    { value: 'all', label: 'All Countries' },
  ]);

  const monthOptions: FilterOption[] = [
    { value: 'all', label: 'All Months' },
    ...MONTHS.map(month => ({
      value: month.toLowerCase(),
      label: month,
    })),
  ];

  useEffect(() => {
    // Fetch years
    fetchData(endpoints.yearlyCount).then(({ data }) => {
      if (data) {
        const years = data.map(([year]: [string, number]) => ({
          value: year.toString(),
          label: year.toString(),
        }));
        setYearOptions([{ value: 'all', label: 'All Years' }, ...years]);
      }
    });

    // Fetch countries
    fetchData(endpoints.countries).then(({ data }) => {
      if (data) {
        const countries = data.map((country: string) => ({
          value: country,
          label: country,
        }));
        setCountryOptions([{ value: 'all', label: 'All Countries' }, ...countries]);
      }
    });
  }, []);

  return {
    yearOptions,
    monthOptions,
    countryOptions,
  };
}
'use client';

import { useState } from 'react';
import type { FilterValues, FilterKey } from '@/lib/types/filters';

const defaultFilters: FilterValues = {
  year: 'all',
  month: 'all',
  country: 'all',
};

export function useFilters(onChange?: (filters: FilterValues) => void) {
  const [filters, setFilters] = useState<FilterValues>(defaultFilters);

  const handleFilterChange = (key: FilterKey, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onChange?.(newFilters);
  };

  return {
    filters,
    handleFilterChange,
  };
}
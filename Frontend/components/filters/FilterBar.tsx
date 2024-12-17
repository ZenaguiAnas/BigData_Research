'use client';

import { SelectFilter } from './SelectFilter';
import { useFilters } from '@/lib/hooks/useFilters';
import { useFilterOptions } from '@/lib/hooks/useFilterOptions';
import type { FilterValues } from '@/lib/types/filters';

interface FilterBarProps {
  onFilterChange: (filters: FilterValues) => void;
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const { filters, handleFilterChange } = useFilters(onFilterChange);
  const { yearOptions, monthOptions, countryOptions } = useFilterOptions();

  return (
    <div className="flex gap-4 mb-6">
      <SelectFilter
        value={filters.year}
        onValueChange={(value) => handleFilterChange('year', value)}
        placeholder="Select Year"
        options={yearOptions}
      />

      <SelectFilter
        value={filters.month}
        onValueChange={(value) => handleFilterChange('month', value)}
        placeholder="Select Month"
        options={monthOptions}
      />

      <SelectFilter
        value={filters.country}
        onValueChange={(value) => handleFilterChange('country', value)}
        placeholder="Select Country"
        options={countryOptions}
      />
    </div>
  );
}
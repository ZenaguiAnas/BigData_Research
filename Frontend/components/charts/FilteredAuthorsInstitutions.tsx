'use client';

import { useState } from 'react';
import { ChartContainer } from './ChartContainer';
import { FilterBar, type FilterValues } from '../filters/FilterBar';
import { AuthorsChart } from './AuthorsChart';
import { UniversitiesChart } from './UniversitiesChart';

export default function FilteredAuthorsInstitutions() {
  const [filters, setFilters] = useState<FilterValues>({
    year: '',
    month: '',
    country: '',
  });

  return (
    <div className="space-y-6">
      <FilterBar onFilterChange={setFilters} />
      <div className="grid gap-6 md:grid-cols-2">
        <ChartContainer title="Top Contributing Authors">
          <AuthorsChart filters={filters} />
        </ChartContainer>
        <ChartContainer title="Leading Universities">
          <UniversitiesChart filters={filters} />
        </ChartContainer>
      </div>
    </div>
  );
}
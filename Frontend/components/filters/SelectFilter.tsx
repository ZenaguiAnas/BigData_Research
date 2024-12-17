'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FilterOption } from '@/lib/types/filters';

interface SelectFilterProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: FilterOption[];
  className?: string;
}

export function SelectFilter({
  value,
  onValueChange,
  placeholder,
  options,
  className = 'w-[180px]',
}: SelectFilterProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map(({ value, label }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
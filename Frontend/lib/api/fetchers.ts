import { API_BASE_URL } from '../constants';
import type { ApiResponse } from '../types/api';

export async function fetchData<T>(
  endpoint: string,
  transform?: (data: any) => T
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
      data: transform ? transform(data) : data,
      error: null,
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while fetching data',
    };
  }
}

export async function fetchFilterData() {
  const [yearsResponse, countriesResponse] = await Promise.all([
    fetchData(endpoints.yearlyCount),
    fetchData(endpoints.countries),
  ]);

  return {
    years: yearsResponse.data?.map(([year]: [string, number]) => year) ?? [],
    countries: countriesResponse.data ?? [],
  };
}
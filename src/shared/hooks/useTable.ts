import { useState, useMemo, useEffect } from 'react';

interface UseTableOptions<T> {
  data: T[];
  searchFields: (keyof T)[];
  initialPageSize?: number;
}

interface UseTableReturn<T> {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  currentPage: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  filteredData: T[];
  paginatedData: T[];
  totalItems: number;
  totalPages: number;
}

export function useTable<T extends Record<string, unknown>>({
  data,
  searchFields,
  initialPageSize = 10,
}: UseTableOptions<T>): UseTableReturn<T> {
  const [searchTerm, setSearchTermRaw] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setPage] = useState(1);
  const [pageSize, setPageSizeRaw] = useState(initialPageSize);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const setSearchTerm = (value: string) => {
    setSearchTermRaw(value);
  };

  const setPageSize = (size: number) => {
    setPageSizeRaw(size);
    setPage(1);
  };

  // Filter data using memoization
  const filteredData = useMemo(() => {
    if (!debouncedSearch.trim()) return data;
    const lower = debouncedSearch.toLowerCase();
    return data.filter((item) =>
      searchFields.some((field) => {
        const val = item[field];
        return val != null && String(val).toLowerCase().includes(lower);
      }),
    );
  }, [data, debouncedSearch, searchFields]);

  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Clamp current page if total pages shrinks
  const safePage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, safePage, pageSize]);

  return {
    searchTerm,
    setSearchTerm,
    currentPage: safePage,
    setPage,
    pageSize,
    setPageSize,
    filteredData,
    paginatedData,
    totalItems,
    totalPages,
  };
}

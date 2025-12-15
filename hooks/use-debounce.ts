import { useState, useEffect } from 'react';

/**
 * ⚡ PERF: Custom hook that debounces a value.
 * Useful for reducing expensive operations triggered by rapid value changes,
 * such as search input filtering.
 * 
 * @param value - The value to debounce
 * @param delay - Debounce delay in milliseconds (default: 150ms)
 * @returns The debounced value
 * 
 * @example
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 200);
 * // Use debouncedSearch for filtering instead of search
 */
export function useDebounce<T>(value: T, delay: number = 150): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Set up timer to update debounced value after delay
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Clean up timer on value change or unmount
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}

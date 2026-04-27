import { useMemo, useCallback } from "react";

/**
 * Hook to memoize expensive calculations with auto-cleanup
 */
export function useMemoized<T>(factory: () => T, deps: any[]): T {
  return useMemo(factory, deps);
}

/**
 * Hook to memoize a callback function with stable reference
 */
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: any[],
): T {
  return useCallback(callback, deps) as T;
}

/**
 * Hook to track previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

/**
 * Hook to detect when value changes
 */
export function useValueDidChange<T>(value: T): boolean {
  const previous = usePrevious(value);
  return previous !== value;
}

import { useEffect, useRef } from "react";

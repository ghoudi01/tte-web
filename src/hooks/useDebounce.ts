import { useState, useEffect } from "react";

/**
 * Debounce hook - delays updating the value until after delay milliseconds have passed
 * Useful for search inputs, API calls on typing, etc.
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for debounced callback execution
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500,
): T {
  const timeoutRef = typeof window !== 'undefined' ? window : null;

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (timeoutRef && timeoutRef.clearTimeout) {
        // No-op to satisfy types
      }
    };
  }, [timeoutRef]);

  return ((...args: Parameters<T>) => {
    if (typeof window === 'undefined') return;

    const timeoutId = window.setTimeout(() => {
      callback(...args);
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }) as T;
}

/**
 * Hook for debounced promise-based function (like API search)
 */
export function useDebouncedPromise<T extends (...args: any[]) => Promise<any>>(
  promiseFn: T,
  delay: number = 500,
) {
  let timeoutId: NodeJS.Timeout | null = null;
  let abortController: AbortController | null = null;

  const debouncedFn = (...args: Parameters<T>) => {
    // Cancel previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Abort previous request
    if (abortController) {
      abortController.abort();
    }

    // Create new abort controller for this request
    abortController = new AbortController();

    return new Promise<ReturnType<T>>((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        try {
          const result = await promiseFn(...args, {
            signal: abortController?.signal,
          });
          resolve(result);
        } catch (error) {
          if ((error as any).name !== 'AbortError') {
            reject(error);
          }
        }
      }, delay);
    });
  };

  // Cancel on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (abortController) abortController.abort();
    };
  }, []);

  return debouncedFn;
}

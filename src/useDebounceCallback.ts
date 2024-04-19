/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef } from "react";

export const useDebouncedCallback = (callback: (...args: any[]) => void, delay: number) => {
    const timeout = useRef<ReturnType<typeof setTimeout>>();
  
    const debouncedFunction = useCallback(
      (...args: any[]) => {
        const later = () => {
            callback(...args);
        };
  
        clearTimeout(timeout.current);
        timeout.current = setTimeout(later, delay);
      },
      [callback, delay]
    );

    return debouncedFunction;
  };
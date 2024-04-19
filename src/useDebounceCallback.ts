/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef } from "react";

export const useDebouncedCallback = <T extends (...args: any[]) => void>(callback: T, delay: number) => {
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
    const callbackRef = useRef<T>(callback);

    // Update the current callback with each render if it changes
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);


    const debouncedFunction = useCallback((...args: any[]) => {
        // Clears the existing timeout to ensure that it only fires once per delay period
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
    
        // Sets a new timeout
        timeoutRef.current = setTimeout(() => {
          callbackRef.current(...args);
        }, delay);
      }, [delay]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return debouncedFunction;
  };
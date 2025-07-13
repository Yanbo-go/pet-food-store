import { useCallback, useRef } from "react";

function useDebounce(callback, delay) {
  const timerRef = useRef();

  const debouncedCallback = useCallback(
    (...args) => {
      return new Promise((resolve) => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
          const result = callback(...args);
          resolve(result);
        }, delay);
      });
    },
    [callback, delay]
  );

  return debouncedCallback;
}

export default useDebounce;

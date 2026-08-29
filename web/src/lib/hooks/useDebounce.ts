import { useEffect, useState } from "react";

export default function useDebounce<T>(value: T, delay: number = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    return () => {
      clearTimeout(timer);
    };
  }, [delay, value]);

  return debouncedValue;
}

import { useEffect, useState } from "react";
import { useDebounce as useDebounceFromReactUse } from "react-use";

export function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const debounced = useDebounceFromReactUse(value, delay);

  useEffect(() => {
    setDebouncedValue(debounced);
  }, [debounced]);

  return debouncedValue as T;
}

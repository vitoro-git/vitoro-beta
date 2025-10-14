import { useEffect, useState } from "react";

export default function useLocalStorage<T>(key: string, initialValue: T) {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    const local = localStorage.getItem(key);
    if (!local) return;
    const json = JSON.parse(local);
    if (json === null) return;
    setState(json);
  }, [key]);

  function updateState(newState: T) {
    setState(newState);
    localStorage.setItem(key, JSON.stringify(newState));
  }

  return [state, updateState] as const;
}

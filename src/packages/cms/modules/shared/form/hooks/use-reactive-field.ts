import { useState, useEffect } from "react";

export type StoreSelector<TState, TField> = (state: TState) => TField | undefined;
export interface GenericStoreApi<TState> {
  getState: () => TState;
  subscribe: (listener: (state: TState) => void) => () => void;
}

/**
 * Generic reactive field hook
 * This function create local state and update it when the store changes
 * @param store - The store to subscribe to
 * @param selector - The selector to use to get the field value
 * @returns The field value
 */
export function useReactiveField<TState, TField>(
  store: GenericStoreApi<TState>,
  selector: StoreSelector<TState, TField>,
): TField | undefined {
  const [selectedState, setSelectedState] = useState(() => selector(store.getState()));

  useEffect(() => {
    return store.subscribe((state) => {
      const newSelected = selector(state);
      setSelectedState(newSelected);
    });
  }, [store, selector]);

  return selectedState;
}

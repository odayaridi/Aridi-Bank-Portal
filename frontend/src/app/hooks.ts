import { useDispatch, useSelector,type TypedUseSelectorHook } from "react-redux";
// useDispatch: Let’s you send actions to the store.
// useSelector: Let’s you read values from the store.
// TypedUseSelectorHook: A type helper for useSelector.

import type { RootState, AppDispatch } from "./store";

// Use throughout the app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

import { useSelector as useDefaultSelector, type TypedUseSelectorHook } from 'react-redux';
import { useDispatch as useDefaultDispatch } from 'react-redux';
import type { AppDispatch,  RootState } from './../store/store';

export const useDispatch: () => AppDispatch = useDefaultDispatch;
export const useSelector: TypedUseSelectorHook<RootState>=useDefaultSelector;


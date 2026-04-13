import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

export const useAppDispatch: () => AppDispatch = () => useDispatch<AppDispatch>()

export function useAppSelector<TSelected>(
  selector: (state: any) => TSelected,
): TSelected {
  return useSelector(selector)
}


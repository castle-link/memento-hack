import type { RootState } from '../types'
import { initialState } from './user.constants'

export const selectUserState = (state: RootState) => state?.user || initialState

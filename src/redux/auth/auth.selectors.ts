import type { RootState } from '../types'
import { createSelector, type Selector } from '@reduxjs/toolkit'
import { initialState } from './auth.constants'

export const selectAuthState = (state: RootState) => state?.auth || initialState

export const selectIsAuthenticated = createSelector(
	selectAuthState,
	(state) => state.isAuthenticated
)

export const selectUser = createSelector(selectAuthState, (state) => state.user)

export const selectUserId = createSelector(selectUser, (user) => user?._id)
export const selectUserHandle = createSelector(
	selectUser,
	(user) => user?.handle || user?._id
)

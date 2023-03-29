import { persistReducer } from 'redux-persist'
import { createSlice, Slice } from '@reduxjs/toolkit'
import { AuthReducers, AuthState } from './auth.types'
import { initialState } from './auth.constants'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { logoutAction, updateUserAction } from './auth.actions'

export const authSlice: Slice<AuthState, AuthReducers, 'auth'> = createSlice<
	AuthState,
	AuthReducers,
	'auth'
>({
	name: 'auth',
	initialState,
	reducers: {
		setUser: (state = initialState, action) => ({
			...state,
			user: action.payload.user,
			accessToken: action.payload.accessToken,
			accessTokenExpiry: action.payload.accessTokenExpiry,
			isAuthenticated: true,
		}),
	},
	extraReducers(builder) {
		builder
			.addCase(updateUserAction.fulfilled, (state, { payload: user }) => ({
				...state,
				user,
			}))
			.addCase(logoutAction.fulfilled, (_state) => initialState)
	},
})

const authPersistConfig = {
	key: 'auth',
	storage,
}

export const authReducer = persistReducer<AuthState>(
	authPersistConfig,
	authSlice.reducer
)
export const { setUser } = authSlice.actions

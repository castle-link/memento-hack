import { persistReducer } from 'redux-persist'
import { createSlice, Slice } from '@reduxjs/toolkit'
import { UserReducers, UserState } from './user.types'
import { initialState } from './user.constants'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { logoutAction } from '../auth/auth.actions'

export const userSlice: Slice<UserState, UserReducers, 'user'> = createSlice<
	UserState,
	UserReducers,
	'user'
>({
	name: 'user',
	initialState,
	reducers: {
		setUser: (state = initialState, action) => {
			return {
				...state,
				created: action.payload.created,
				collectors: action.payload.collectors,
				collected: action.payload.collected,
			}
		},
	},
	extraReducers(builder) {
		builder.addCase(logoutAction.fulfilled, (_state) => initialState)
	},
})

const userPersistConfig = {
	key: 'user',
	storage,
	blacklist: [], // May have to add state here (e.g. 'collectors')
}

export const userReducer = persistReducer<UserState>(
	userPersistConfig,
	userSlice.reducer
)

export const { setUser } = userSlice.actions

import { TUser } from '@/models/User'
import { PayloadAction, Reducer } from '@reduxjs/toolkit'

export type SetUserAction = {
	type: string
	payload: {
		user: TUser
		accessToken: string
		accessTokenExpiry: number
	}
}

export type LogoutAction = {
	type: string
}

export type AuthReducers = {
	setUser: Reducer<AuthState, SetUserAction>
}

export interface AuthState {
	user: Maybe<TUser>
	accessToken: string | null
	accessTokenExpiry: number | null
	isAuthenticated: boolean
}

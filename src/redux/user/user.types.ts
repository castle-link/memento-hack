import { PopulatedClaim, TClaim } from '@/models/Claim'
import { DecoratedMemento, PopulatedMemento } from '@/models/Memento'
import { TUser } from '@/models/User'
import { PayloadAction, Reducer } from '@reduxjs/toolkit'

export type SetUserAction = {
	type: string
	payload: {
		collected: PopulatedClaim[]
		collectors: PopulatedClaim[]
		created: DecoratedMemento[]
	}
}

export type LogoutAction = {
	type: string
}

export type UserReducers = {
	setUser: Reducer<UserState, SetUserAction>
}

export interface UserState {
	created: Maybe<DecoratedMemento[]>
	collectors: Maybe<PopulatedClaim[]>
	collected: Maybe<PopulatedClaim[]>
}

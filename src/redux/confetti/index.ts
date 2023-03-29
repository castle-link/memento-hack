import { createSlice, Slice, Reducer } from '@reduxjs/toolkit'

export interface ConfettiState {
	confettiToggle: boolean
}

type ToggleConfettiAction = {
	type: string
	payload: boolean
}

type ConfettiReducers = {
	toggleConfetti: Reducer<ConfettiState, ToggleConfettiAction>
}

const initialState = {
	confettiToggle: false,
}

export const confettiSlice: Slice<ConfettiState, ConfettiReducers, 'confetti'> =
	createSlice<ConfettiState, ConfettiReducers, 'confetti'>({
		name: 'confetti',
		initialState,
		reducers: {
			toggleConfetti: (state = initialState, action) => ({
				...state,
				confettiToggle: action.payload,
			}),
		},
	})

export const { toggleConfetti } = confettiSlice.actions
export const confettiReducer = confettiSlice.reducer

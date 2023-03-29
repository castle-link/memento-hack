import { configureStore, combineReducers, AnyAction } from '@reduxjs/toolkit'
import type { RootState as _RootState } from './types'
import { authReducer } from './auth'
import { userReducer } from './user'
import { confettiReducer } from './confetti'
import { persistStore, persistReducer, type PersistConfig } from 'redux-persist'
import { PersistPartial } from 'redux-persist/es/persistReducer'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import thunk from 'redux-thunk'
import { ThunkMiddlewareFor } from '@reduxjs/toolkit/dist/getDefaultMiddleware'

// import {
// 	createStateSyncMiddleware,
// 	initMessageListener,
// 	initStateWithPrevTab,
// 	withReduxStateSync,
// } from 'redux-state-sync'

const rootReducer = combineReducers<_RootState>({
	auth: authReducer,
	user: userReducer,
	confetti: confettiReducer,
})

const persistConfig: PersistConfig<_RootState> = {
	key: 'root',
	storage,
	blacklist: ['auth'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
// withReduxStateSync(

// )

export const store = configureStore<
	_RootState & PersistPartial,
	AnyAction,
	[ThunkMiddlewareFor<_RootState>]
>({
	reducer: persistedReducer,
	devTools: process.env.NODE_ENV !== 'production',
	middleware: [
		thunk,
		// // @ts-ignore
		// ...(typeof window !== undefined
		// 	? [
		// 			createStateSyncMiddleware({
		// 				blacklist: ['persist/PERSIST', 'persist/REHYDRATE'],
		// 			}),
		// 	  ]
		// 	: []),
	],
})

// initStateWithPrevTab(store)

export const persistor = persistStore(store)

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

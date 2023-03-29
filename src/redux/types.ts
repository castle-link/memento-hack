import { AuthState } from './auth/auth.types'
import { UserState } from './user/user.types'
import { ConfettiState } from './confetti'
import { PersistPartial } from 'redux-persist/es/persistReducer'

export interface RootState {
	auth: AuthState & PersistPartial
	user: UserState & PersistPartial
	confetti: ConfettiState
	// & PersistPartial
}

import { createAsyncThunk } from '@reduxjs/toolkit'
import type { TUser } from '@/models/User'
import type { RootState } from '../store'
import { getConfig } from '@/config'
import { Logger } from '@/utils/logger'

export const updateUserAction = createAsyncThunk<
	TUser,
	Pick<TUser, 'bio' | 'name' | 'profilePicUrl' | 'handle'>
>('auth/updateUser', async (update, { getState }) => {
	const state = getState() as RootState
	const userId = state.auth.user?._id

	if (!userId) throw new Error('User not connected')

	try {
		const { user } = await getConfig().api.patch(`/api/users/${userId}`, {
			body: update,
		})
		return user
	} catch (e: any) {
		Logger.logError(e, 'Error updating user')
		throw e
	}
})

export const logoutAction = createAsyncThunk(
	'user/clear',
	async (_, { dispatch }) => {
		// Add actions pertaining to other redux slices here
		return getConfig().api.post('/api/auth/logout')
	}
)

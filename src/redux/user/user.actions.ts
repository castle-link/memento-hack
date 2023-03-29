import { createAsyncThunk } from '@reduxjs/toolkit'
import { _fetchUser } from 'src/queries/user.queries'
import { setUser } from './user.reducer'

export const fetchUserAction = createAsyncThunk<
	void,
	{
		userId: string
	}
>('user/fetchUser', async ({ userId }, { dispatch }) => {
	const res = await _fetchUser(userId)

	dispatch(
		setUser({
			created: res.collections,
			collectors: res.collectors,
			collected: res.collected,
		})
	)
})

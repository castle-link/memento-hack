import { getConfig } from '@/config'
import { queryClient } from '@/lib/queryClient'
import { GetUser } from '@/types'

export const _fetchUser = async (userIdOrHandle: string) => {
	const { api } = getConfig()
	const res = await api.get<GetUser.ResponseData>(
		`/api/users/${userIdOrHandle}`
	)

	return res
}

export const fetchUserQuery = ({ queryKey }: { queryKey: string[] }) => {
	const [, userId] = queryKey
	return _fetchUser(userId)
}

export const fetchUser = async (
	userIdOrHandle: string,
	{ withCache = true }: { withCache?: boolean } | undefined = {}
) => {
	if (withCache) {
		return queryClient.fetchQuery(['fetchUser', userIdOrHandle], fetchUserQuery)
	} else {
		const response = await _fetchUser(userIdOrHandle)
		queryClient.setQueriesData(['fetchUser', userIdOrHandle], response)
		return response
	}
}

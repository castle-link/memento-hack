import { QueryClient } from 'react-query'

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			// Reload if data is older than 2 minutes
			staleTime: 1000 * 60 * 2,
			// Keep data stored for 3 hours
			// (for queries that manually set longer stale times)
			cacheTime: 1000 * 60 * 60 * 3,
		},
	},
})

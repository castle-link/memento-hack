import { useContext } from 'react'
import { UserContext } from '../context/user'

export const useUser = () => {
	const context = useContext(UserContext)
	if (!context) throw new Error('useUser must be used within a User Provider')

	return {
		...context,
		loading: context.isExporting,
	}
}

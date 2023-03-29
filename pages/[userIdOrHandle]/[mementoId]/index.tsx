import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

import { MintCollectionPage } from '@/components/PageComponents/Collection/MintCollectionPage'
import { useSelector } from 'react-redux'
import { selectAuthState } from '@/redux/auth'
import { ShareCollectionPage } from '@/components/PageComponents/Collection/ShareCollectionPage'
import { LoadingIndicator } from '@/compound'
import { useQuery } from 'react-query'
import { fetchMemento } from '@/queries/memento.queries'
import moment from 'moment'

const CollectionPage = () => {
	const router = useRouter()
	const { mementoId } = router.query

	const { user, isAuthenticated } = useSelector(selectAuthState)

	const { data, isLoading: loading } = useQuery(
		['memento', mementoId],
		() => fetchMemento(mementoId as string),
		{
			enabled: !!mementoId,
			refetchOnMount: true,
		}
	)

	const memento = useMemo(() => data?.memento, [data])
	const claims = useMemo(() => data?.claims || [], [data])

	const userOwnsCollection = useMemo(() => {
		return isAuthenticated && memento?.user?._id === user?._id
	}, [user, memento, isAuthenticated])

	const daysLeft = useMemo(() => {
		if (memento?.endDate) {
			return Math.max(moment(memento?.endDate).diff(moment(), 'days'), 0)
		}
	}, [memento])

	console.log({
		startDate: memento?.startDate,
		endDate: memento?.endDate,
		diff: moment().diff(memento?.endDate, 'days'),
		daysLeft,
		now: moment().format('ll'),
	})

	return loading || !memento ? (
		<LoadingIndicator minHeight="100vh" />
	) : userOwnsCollection ? (
		<ShareCollectionPage
			memento={memento}
			claims={claims}
			daysLeft={daysLeft}
		/>
	) : (
		<MintCollectionPage memento={memento} claims={claims} />
	)
}

export default CollectionPage

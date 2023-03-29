import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

import { useSelector } from 'react-redux'
import { selectAuthState } from '@/redux/auth'
import { LoadingIndicator } from '@/compound'
import { useQuery } from 'react-query'
import { fetchMemento } from '@/queries/memento.queries'
import { PopulatedMemento } from '@/models/Memento'
import { EmbededMintCollectionPage } from '@/components/PageComponents/Collection/EmbededMintCollectionPage'
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

	return (
		<LoadingIndicator minHeight="100vh" ready={!loading && !!memento}>
			<EmbededMintCollectionPage
				memento={memento as PopulatedMemento}
				claims={claims}
			/>
		</LoadingIndicator>
	)
}

export default CollectionPage

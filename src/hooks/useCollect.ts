import { useQuery } from 'react-query'
import { MEMENTO_ABI } from '@/constants/abis'
import { getInterface, checkDeployed } from '@/lib/blockchain'
import { useMemo, useState } from 'react'
import { emailCheck } from '@/constants/checks'
import { toast } from 'react-toastify'
import { getConfig } from '@/config'
import { ethers } from 'ethers'
import { CreateClaim, GetCheckoutSession, GetClaim } from '@/types'
import { TClaim } from '@/models/Claim'
import { PopulatedMemento, TMemento } from '@/models/Memento'
import { useRouter } from 'next/router'

interface CreateInput {
	name: string
	email: string
}

export const useCollect = () => {
	const [input, setInput] = useState<CreateInput>({ name: '', email: '' })
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [claim, setClaim] = useState<TClaim>()

	const router = useRouter()

	const handleInputChange = (key: keyof CreateInput) => (e: any) => {
		setError(null)
		setInput((old) => ({ ...old, [key]: e.target.value }))
	}

	const createClaim = async ({
		info,
		mementoId,
		email,
		name,
		address,
	}: {
		info: PopulatedMemento
		mementoId: string
		email?: string | null
		address?: string | null
		name: string
	}) => {
		return getConfig().api.post<
			CreateClaim.ResponseData,
			CreateClaim.RequestBody
		>('/api/claims', {
			body: {
				name,
				email,
				info,
				address,
				mementoId,
			},
		})
	}

	const collectMemento = async (mementoId: string, info: PopulatedMemento) => {
		try {
			setError(null)
			if (!input.name) {
				setError('Please enter your name')
				return { claim: null }
			}

			if (!input.email) {
				setError('Please enter your email')
				return { claim: null }
			}

			console.log({ check: input.email.match(emailCheck) })
			if (
				!ethers.utils.isAddress(input.email) &&
				!input.email.match(emailCheck)
			) {
				setError('Please enter a valid email')
				return { claim: null }
			}

			setLoading(true)
			// const address = ethers.utils.isAddress(input.email) ? input.email : null
			const email = input.email
			const name = input.name

			if (info.productId) {
				const response =
					await getConfig().api.get<GetCheckoutSession.ResponseData>(
						`/api/mementos/${info.slug}/checkout?email=${encodeURIComponent(
							email
						)}`
					)

				if (response.session.url) {
					router.push(response.session.url)
				}

				return { claim: null }
			}

			const { claim } = await createClaim({
				info,
				email,
				name,
				mementoId,
			})

			setClaim(claim)

			return { claim }
		} finally {
			setLoading(false)
		}
	}

	const checkoutSessionId = useMemo(
		() => router.query.checkout_session_id,
		[router.query]
	)

	console.log({ checkoutSessionId })

	const { isLoading: claimLoading } = useQuery(
		['claim', checkoutSessionId],
		() => {
			return getConfig().api.get<GetClaim.ResponseData>(
				`/api/claims?checkoutSessionId=${checkoutSessionId}`
			)
		},
		{
			enabled: !!checkoutSessionId,
			onSuccess(data) {
				setClaim(data.claim)
			},
		}
	)

	return {
		handleInputChange,
		collectMemento,
		input,
		error,
		loading: claimLoading || loading,
		claim,
	}
}

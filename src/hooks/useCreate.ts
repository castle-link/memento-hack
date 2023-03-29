import { useEffect } from 'react'
// Will handle things related to creating a memento

import { useCallback, useMemo, useState } from 'react'
import { handleAbi, handleAddress, handleFunctionName } from '@/lib/memento'
import { BigNumber } from 'ethers'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { useUser } from './useUser'
import { getConfig } from '@/config'
import VideoSnapshot from 'video-snapshot'
import { useDispatch } from '@/redux/hooks'
import { fetchUserAction } from '@/redux/user/user.actions'
import moment from 'moment'
import { toNumber } from 'lodash'
import { useQuery } from 'react-query'
import { CreateMemento, GetAccountLink, GetMerchantAccount } from '@/types'

interface FormData {
	title: { value: string; error: Maybe<string> }
	price: { value: string; error: Maybe<string> }
	uploadedImage: { value: string; error: Maybe<string> }
	description: { value: string; error: Maybe<string> }
	editionType: { value: string; error: Maybe<string> }
	numberOfEditions: { value: number; error: Maybe<string> }
	startDate: { value: Date; error: Maybe<string> }
	endDate: { value: Date; error: Maybe<string> }
	isImmediate: { value: boolean; error: Maybe<string> }
	isUnlimited: { value: boolean; error: Maybe<string> }
	isOngoing: { value: boolean; error: Maybe<string> }
}

export const useCreate = () => {
	// Hooks
	const router = useRouter()
	const dispatch = useDispatch()
	const { user } = useUser()

	// States

	const [videoSnapshotUrl, setVideoSnapshotUrl] = useState<string | undefined>()
	const [isUploading, setIsUploading] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [paymentsEnabled, setPaymentsEnabled] = useState(false)

	const [formData, setFormData] = useState<FormData>({
		title: { value: '', error: null },
		price: { value: '', error: null },
		uploadedImage: { value: '', error: null },
		description: { value: '', error: null },
		editionType: { value: 'Fixed', error: null },
		numberOfEditions: { value: 100, error: null },
		startDate: { value: new Date(), error: null },
		endDate: {
			value: new Date(new Date().setDate(new Date().getDate() + 7)),
			error: null,
		},
		isImmediate: { value: true, error: null },
		isUnlimited: { value: false, error: null },
		isOngoing: { value: false, error: null },
	})

	const {
		title: { value: title },
		price: { value: price },
		uploadedImage: { value: uploadedImage },
		description: { value: description },
		editionType: { value: editionType },
		numberOfEditions: { value: numberOfEditions },
		startDate: { value: startDate },
		endDate: { value: endDate },
		isImmediate: { value: isImmediate },
		isUnlimited: { value: isUnlimited },
		isOngoing: { value: isOngoing },
	} = useMemo(() => formData, [formData])

	const onChangeForm = useCallback(
		(name: keyof FormData) => (value: any) => {
			setFormData((prev) => ({
				...prev,
				[name]: {
					value,
					error: null,
				},
			}))
		},
		[]
	)

	const onSetError = useCallback((name: keyof FormData, error: string) => {
		setFormData((prev) => ({
			...prev,
			[name]: {
				...prev[name],
				error,
			},
		}))
	}, [])

	console.log({
		title,
		uploadedImage,
		description,
		editionType,
		numberOfEditions,
		startDate,
		endDate,
		isImmediate,
		isUnlimited,
		isOngoing,
		price,
	})

	// Memoized values
	const base64EncodedCollection = useMemo(() => {
		return (
			'data:application/json;base64,' +
			btoa(
				unescape(
					encodeURIComponent(
						JSON.stringify({
							name: title,
							description,
							image: uploadedImage,
						})
					)
				)
			)
		)
	}, [title, description, uploadedImage])

	const address = useMemo(() => {
		return handleAddress(
			BigNumber.from(endDate.getTime()).div(1000),
			BigNumber.from(numberOfEditions)
		)
	}, [endDate, numberOfEditions])

	const abi = useMemo(() => {
		return handleAbi(address)
	}, [address])

	const functionName = useMemo(() => {
		return handleFunctionName(
			BigNumber.from(endDate.getTime()).div(1000),
			BigNumber.from(numberOfEditions)
		)
	}, [endDate, numberOfEditions])

	const handleCreation = useCallback(
		async ({
			title,
			description,
			symbol,
			media,
			uploadedAsset,
			start,
			end,
			numberOfEditions,
			creator,
			isOngoing,
			isUnlimited,
			email,
			transactionHash,
			address,
			snapshotUrl,
			price,
		}: {
			title: string
			description: string
			symbol: string
			price: number | null
			media: string
			uploadedAsset: string
			start: number
			end?: number
			numberOfEditions?: number
			creator: string
			isOngoing: boolean
			isUnlimited: boolean
			email?: string
			transactionHash?: string
			address?: string
			snapshotUrl?: string
		}) => {
			const { memento } =
				await getConfig().api.post<CreateMemento.ResponseData>(
					`/api/mementos`,
					{
						body: {
							title,
							description,
							symbol,
							media,
							uploadedAsset,
							start,
							end,
							price,
							numberOfEditions: isUnlimited ? undefined : numberOfEditions,
							creator,
							isOngoing,
							isUnlimited,
							email,
							transactionHash,
							address,
							snapshotUrl,
						},
					}
				)
			await dispatch(fetchUserAction({ userId: user?._id as string }))
			return memento
		},
		[dispatch, user?._id]
	)

	const hasCompletedMerchantOnboarding = useMemo(
		() => router.query.setup_complete === 'true',
		[router.query]
	)
	const { data } = useQuery(
		['merchantAccount', user?._id],
		() => {
			return getConfig().api.get<GetMerchantAccount.ResponseData>(
				`/api/merchant-account`
			)
		},
		{
			enabled: !!user?._id,
			refetchInterval:
				hasCompletedMerchantOnboarding && !paymentsEnabled ? 1000 * 2 : false,
			onSuccess: (data) => {
				setPaymentsEnabled(data?.merchantAccount?.charges_enabled)
			},
		}
	)

	const isVerifyingMerchant = useMemo(
		() => hasCompletedMerchantOnboarding && !paymentsEnabled,
		[hasCompletedMerchantOnboarding, paymentsEnabled]
	)

	const onSetupPayments = useCallback(async () => {
		const response = await getConfig().api.post<GetAccountLink.ResponseData>(
			`/api/merchant-account/link`
		)

		router.push(response.accountLink.url)
	}, [router])

	const validateFormData = useCallback(() => {
		let isValid = true
		if (!title) {
			onSetError('title', 'Please enter a title')
			isValid = false
		}

		if (!uploadedImage) {
			onSetError('uploadedImage', 'Add an file for your memento')
			isValid = false
		}

		console.log({ startDate, endDate })
		if (moment(startDate).isAfter(moment(endDate))) {
			console.log('settings error')
			onSetError('startDate', 'Start date cannot be after end date')
			isValid = false
		}

		if (numberOfEditions <= 0) {
			onSetError(
				'numberOfEditions',
				'Number of editions must be greater than 0'
			)
			isValid = false
		}

		if (price && toNumber(price) > 0 && !paymentsEnabled) {
			onSetError(
				'price',
				'In order to set a price, please setup a payment account'
			)
			isValid = false
		}

		return isValid
	}, [
		title,
		uploadedImage,
		endDate,
		price,
		numberOfEditions,
		onSetError,
		startDate,
		paymentsEnabled,
	])

	const createWithEmail = useCallback(async () => {
		if (!user?.email) {
			// This should not happen
			toast.error('An error occured. Please try again later.')
			return
		}

		const isValid = validateFormData()

		if (!isValid) return

		try {
			setIsSubmitting(true)
			const memento = await handleCreation({
				title,
				description,
				price: price ? toNumber(price) : null,
				symbol: process.env.NEXT_PUBLIC_MEMENTO_SYMBOL_BASE as string,
				media: base64EncodedCollection,
				uploadedAsset: uploadedImage,
				start: startDate.getTime(),
				end: endDate.getTime(),
				numberOfEditions,
				creator: user.multiSig as string,
				isOngoing,
				isUnlimited,
				email: user?.email as string,
				snapshotUrl: videoSnapshotUrl,
			})

			toast.success('Memento created')
			getConfig().navigation.goToCollection(memento)
		} catch (e: any) {
			toast.error('An error occured. Please try again later.')
		} finally {
			setIsSubmitting(false)
		}
	}, [
		base64EncodedCollection,
		description,
		endDate,
		handleCreation,
		isOngoing,
		isUnlimited,
		numberOfEditions,
		startDate,
		title,
		uploadedImage,
		user?.email,
		user?.multiSig,
		validateFormData,
		videoSnapshotUrl,
		price,
	])
	const createWithEoa = useCallback(
		async (hash: string) => {
			const isValid = validateFormData()
			if (!isValid) return

			try {
				setIsSubmitting(true)
				const memento = await handleCreation({
					title,
					description,
					price: price ? toNumber(price) : null,
					symbol: process.env.NEXT_PUBLIC_MEMENTO_SYMBOL_BASE as string,
					media: base64EncodedCollection,
					uploadedAsset: uploadedImage,
					start: startDate.getTime(),
					end: endDate.getTime(),
					numberOfEditions: numberOfEditions,
					creator: user?.eoa as string,
					transactionHash: hash as string,
					isOngoing,
					isUnlimited: isUnlimited,
					address: user?.eoa as string,
					snapshotUrl: videoSnapshotUrl,
				})
				getConfig().navigation.goToCollection(memento)
			} catch (e: any) {
				toast.error('An error occured. Please try again later.')
			} finally {
				setIsSubmitting(false)
			}
		},
		[
			base64EncodedCollection,
			description,
			endDate,
			price,
			handleCreation,
			isOngoing,
			isUnlimited,
			numberOfEditions,
			startDate,
			title,
			uploadedImage,
			user?.eoa,
			validateFormData,
			videoSnapshotUrl,
		]
	)

	const uploadImage = useCallback(
		async (e: any) => {
			e.preventDefault()
			try {
				setIsUploading(true)
				let formData = new FormData()
				const file = e.target.files?.[0]
				console.log({ file })
				if (file.type.includes('video')) {
					const videoSnapshot = new VideoSnapshot(file)
					const image = await videoSnapshot.takeSnapshot()
					console.log({ image })
					let img = document.createElement('img')
					img.src = image
					img.onload = async (e) => {
						let canvas = document.createElement('canvas')
						canvas.width = 500
						canvas.height = 500
						let ctx = canvas.getContext('2d')
						ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
						let compressedImage = ctx?.canvas.toDataURL('image/png', 10)
						let formData = new FormData()
						formData.append('image', compressedImage as string)
						formData.append('file', compressedImage as string)
						formData.append('upload_preset', 'castle-memento-unsigned')
						const snapshotData = await fetch(
							`${process.env.NEXT_PUBLIC_CLOUDINARY_URL}${process.env.NEXT_PUBLIC_CLOUDINARY_ACCOUNT}/auto/upload`,
							{
								method: 'POST',
								body: formData,
							}
						).then((res) => res.json())
						setVideoSnapshotUrl(snapshotData?.url)
					}
				}

				if (!file) return
				formData.append('file', file)
				formData.append('upload_preset', 'castle-memento-unsigned')

				let formdata = new FormData()
				console.log(formdata)
				formdata.append('image', file)
				const imageData = await fetch(
					`${process.env.NEXT_PUBLIC_CLOUDINARY_URL}${process.env.NEXT_PUBLIC_CLOUDINARY_ACCOUNT}/auto/upload`,
					{
						method: 'POST',
						body: formData,
					}
				).then((res) => res.json())
				onChangeForm('uploadedImage')(imageData.secure_url)
				toast.success(videoSnapshotUrl ? 'Video uploaded' : 'Image uploaded')
			} catch (e: any) {
				console.error('Error uploading image')
				console.error(e)
				toast.error('Error uploading asset', {
					position: toast.POSITION.BOTTOM_CENTER,
				})
			} finally {
				setIsUploading(false)
			}
		},
		[onChangeForm, videoSnapshotUrl]
	)

	return {
		createWithEmail,
		uploadImage,
		isSubmitting,
		isUploading,
		createWithEoa,
		address,
		abi,
		functionName,
		media: base64EncodedCollection,
		onChangeForm,
		formData,
		onSetupPayments,
		isVerifyingMerchant,
		paymentsEnabled,
	}
}

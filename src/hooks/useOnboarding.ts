import { getConfig } from '@/config'
import { updateUserAction } from '@/redux/auth/auth.actions'
import { useDispatch } from '@/redux/hooks'
import { Logger } from '@/utils/logger'
import _ from 'lodash'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import type { OnboardingFormData } from './types'
import { useUser } from './useUser'

export const useOnboarding = () => {
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const { user } = useUser()
	const [profilePicUrl, setProfilePicUrl] = useState<string | undefined>(
		user?.profilePicUrl
	)

	const [handleIsAvailable, setHandleIsAvailable] = useState(false)
	const [checkingAvailability, setCheckingAvailability] = useState(false)

	const dispatch = useDispatch()

	const [onboardingFormData, setOnboardingFormData] =
		useState<OnboardingFormData>({
			name: { value: user?.name || '', error: null },
			bio: { value: user?.bio || '', error: null },
			handle: { value: user?.handle || '', error: null },
		})

	const onChangeText = (name: string) => (input: string) => {
		const newValue =
			name === 'handle' ? input.replace(/[^a-zA-Z0-9\_]/g, '') : input

		setOnboardingFormData((old) => ({
			...old,
			[name]: { value: newValue, error: null },
		}))

		if (name === 'handle' && newValue) {
			setCheckingAvailability(true)
			setHandleIsAvailable(true)
			checkHandleAvailability(newValue)
		}
	}

	const validateForm = useCallback(() => {
		let isValid = true
		if (!onboardingFormData.name.value && !user?.name) {
			setOnboardingFormData((old) => ({
				...old,
				name: { value: old.name.value, error: 'Name is required' },
			}))
			isValid = false
		}

		if (!onboardingFormData.handle.value && !user?.handle) {
			setOnboardingFormData((old) => ({
				...old,
				handle: { value: old.handle.value, error: 'Username is required' },
			}))
			isValid = false
		} else if (
			!handleIsAvailable &&
			user?.handle?.toLowerCase() !=
				onboardingFormData.handle.value?.toLowerCase()
		) {
			setOnboardingFormData((old) => ({
				...old,
				handle: {
					value: old.handle.value,
					error: 'This username is already taken',
				},
			}))
			isValid = false
		}

		return isValid
	}, [onboardingFormData])

	console.log(onboardingFormData)

	const checkHandleAvailability = useMemo(
		() =>
			_.debounce(async (input: string) => {
				console.log('checking availability')
				try {
					setCheckingAvailability(true)
					const { available } = await getConfig().api.get<{
						available: boolean
					}>(`/api/handle?search=${input}`)

					setHandleIsAvailable(available)
				} catch (e: any) {
					Logger.logError(e, 'Error checking handle availability')
					setHandleIsAvailable(false)
				} finally {
					setCheckingAvailability(false)
				}
			}, 300),
		[]
	)

	const handleSubmitOnboardingForm = async () => {
		const isValid = validateForm()

		if (!isValid) return
		// Make a put request
		setLoading(true)

		if (!user) router.push('/') // Need to create user before doing this part

		try {
			await dispatch(
				updateUserAction({
					name: onboardingFormData?.name.value || user?.name,
					bio: onboardingFormData?.bio.value || user?.bio,
					handle: onboardingFormData?.handle.value || user?.handle,
					profilePicUrl,
				})
			).unwrap()

			toast.success('Saved profile updates')

			await getConfig().navigation.goToProfile()
		} catch (error: any) {
			toast.error(error.message, {
				position: toast.POSITION.BOTTOM_CENTER,
			})
		} finally {
			setLoading(false)
		}
	}

	const uploadProfilePic = async (e: any) => {
		console.log('Lmao')
		e.preventDefault()
		let formData = new FormData()
		const file = e.target.files?.[0]

		if (!file) return
		formData.append('file', file)
		formData.append('upload_preset', 'castle-memento-unsigned')

		try {
			let formdata = new FormData()
			formdata.append('image', file)
			const imageData = await fetch(
				`${process.env.NEXT_PUBLIC_CLOUDINARY_URL}${process.env.NEXT_PUBLIC_CLOUDINARY_ACCOUNT}/image/upload`,
				{
					method: 'POST',
					body: formData,
				}
			).then((res) => res.json())
			setProfilePicUrl(imageData.secure_url)
			// toast.success('Image uploaded')
		} catch (error) {
			toast.error('Error uploading image. Please try again.', {
				position: toast.POSITION.BOTTOM_CENTER,
			})
		} finally {
			setLoading(false)
		}
	}

	const handleSkip = () => {
		getConfig().navigation.goToHomeScreen()
	}
	return {
		onChangeText,
		handleSubmitOnboardingForm,
		uploadProfilePic,
		onboardingFormData,
		profilePicUrl,
		handleSkip,
		checkingAvailability,
		loading,
		handleIsAvailable,
	}
}

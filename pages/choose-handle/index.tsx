import styled from 'styled-components'

import PageContainer from '@/components/PageContainer'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Textarea from '@/components/Input/Textarea'

import { useOnboarding } from '@/hooks/useOnboarding'
import Image from 'next/image'
import { Camera } from '@styled-icons/ionicons-outline'
import { Box, Card, Text, TextInput } from '@/compound'
import { useUser } from '@/hooks/useUser'
import { getConfig } from 'src/config'
import { useCallback, useEffect, useMemo, useState } from 'react'
import _ from 'lodash'
import { Logger } from '@/utils/logger'
import { CheckmarkCircle } from '@styled-icons/ionicons-solid'
import { useRouter } from 'next/router'
import { useDispatch } from '@/redux/hooks'
import { updateUserAction } from '@/redux/auth/auth.actions'
import { toast } from 'react-toastify'

const HandlePage = () => {
	// Put request required to update the user

	const [handle, setHandle] = useState('')
	const [isAvailable, setIsAvailable] = useState(false)
	const [checkingAvailability, setCheckingAvailability] = useState(false)
	const { user } = useUser()
	const [loading, setLoading] = useState(false)
	const [showError, setShowError] = useState(false)
	const router = useRouter()
	const dispatch = useDispatch()

	const error = useMemo(() => {
		if (handle.length < 3) return 'Handle must be at least 3 characters'
		if (handle.length > 30) return 'Handle must be less than 30 characters'
	}, [handle])

	const isValid = useMemo(() => {
		return handle.length >= 3 && handle.length <= 30
	}, [handle])

	const checkAvailability = useMemo(
		() =>
			_.debounce(async (input: string) => {
				try {
					setCheckingAvailability(true)
					const { available } = await getConfig().api.get<{
						available: boolean
					}>(`/api/handle?search=${input}`)

					setIsAvailable(available)
				} catch (e: any) {
					Logger.logError(e, 'Error checking handle availability')
					setIsAvailable(false)
				} finally {
					setCheckingAvailability(false)
				}
			}, 300),
		[]
	)

	const updateHandle = useCallback(async () => {
		setShowError(true)
		if (isValid && isAvailable) {
			try {
				await dispatch(updateUserAction({ handle })).unwrap()

				getConfig().navigation.goToHomeScreen()
			} catch (e: any) {
				Logger.error('Error updating handle', e)
				toast.error('Error updating handle', {
					position: toast.POSITION.BOTTOM_CENTER,
				})
			}
		}
	}, [isValid, isAvailable, router])

	useEffect(() => {
		if (isValid) {
			checkAvailability.cancel()
			checkAvailability(handle)
		}
	}, [handle, isValid])

	return (
		<PageContainer>
			<Text bold align="center" fontSize={32} spacing="mb2">
				Choose your handle
			</Text>
			<Card spacing={['ph4', 'pt4', 'pb6']}>
				<Box spacing="mb2">
					<Box stacked="row" align="center" gap="6px">
						<Text smooth fontSize={18}>
							{'https://memento.supply/'}
						</Text>
						<TextInput
							onBlur={() => {
								setShowError(true)
							}}
							width="280px"
							suffix={
								!checkingAvailability &&
								isAvailable && (
									<Box stacked="column" justify="center">
										<CheckmarkCircle size={18} color="var(--success-color)" />
									</Box>
								)
							}
							maxLength={30}
							placeholder={user?.handle}
							loading={checkingAvailability}
							onChange={async (input) => {
								setHandle(input.replace(/[^a-zA-Z0-9\_]/g, ''))
							}}
							value={handle}
							error={showError ? error : undefined}
						/>
					</Box>
					{/* {error && showError && (
						<Text fontSize={14} spacing={['mb2', 'mt1']} fontColor="error-fg">
							{error}
						</Text>
					)} */}
				</Box>

				<Button
					width="100%"
					action={updateHandle}
					text="Continue"
					type="primary"
					loading={loading}
				/>
			</Card>
		</PageContainer>
	)
}

export default HandlePage

const Header = styled.div`
	align-items: center;
	display: flex;
	flex-direction: column;
	margin-bottom: 64px;
`

const Title = styled.div`
	font-size: 18px;
	font-weight: 500;
	margin-bottom: 4px;
`

const Label = styled.div`
	margin-bottom: 12px;
`

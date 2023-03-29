import styled from 'styled-components'

import PageContainer from '@/components/PageContainer'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Textarea from '@/components/Input/Textarea'

import { useOnboarding } from '@/hooks/useOnboarding'
import Image from 'next/image'
import { Camera } from '@styled-icons/ionicons-outline'
import {
	Box,
	Card,
	getPaletteColor,
	Text,
	TextInput,
	useBreakPoint,
} from '@/compound'
import { useUser } from '@/hooks/useUser'
import { useSelector } from 'react-redux'
import { selectAuthState } from '@/redux/auth'
import {
	CheckmarkCircle,
	Close,
	CloseCircle,
} from '@styled-icons/ionicons-solid'
import { useMemo } from 'react'

const OnboardingPage = () => {
	// Put request required to update the user
	const {
		onChangeText,
		handleSubmitOnboardingForm,
		uploadProfilePic,
		onboardingFormData,
		profilePicUrl,
		handleSkip,
		loading,
		checkingAvailability,
		handleIsAvailable,
	} = useOnboarding()
	const { user } = useSelector(selectAuthState)

	const breakpoint = useBreakPoint()

	const isMobile = useMemo(
		() => ['tablet', 'mobile'].includes(breakpoint),
		[breakpoint]
	)

	return (
		<PageContainer>
			<EditProfileCard spacing={['pt6', 'pb4', 'ph3']}>
				<Header>
					<Title>Tell us about yourself</Title>
					<Subtitle>Add your name, profile picture and bio</Subtitle>

					<div style={{ position: 'relative' }}>
						{profilePicUrl ? (
							<>
								<Upload
									type="file"
									name="file"
									id="file"
									onChange={uploadProfilePic}
									accept="image/png, image/jpeg"
								/>
								<ProfilePicImage
									alt="Profile Picture"
									src={profilePicUrl}
									width={108}
									height={108}
									style={{
										objectFit: 'cover',
									}}
								/>
							</>
						) : (
							<ProfileImage>
								<Upload
									type="file"
									name="file"
									id="file"
									onChange={uploadProfilePic}
									accept="image/png, image/jpeg"
								/>
								<CameraIcon />
							</ProfileImage>
						)}
					</div>
				</Header>

				<FormGroup>
					<Label>Name*</Label>
					<TextInput
						placeholder={user?.name}
						onChange={onChangeText('name')}
						value={onboardingFormData.name.value}
						error={onboardingFormData.name.error}
					/>
				</FormGroup>

				<FormGroup>
					<Label>Username*</Label>
					<UsernameBox stacked="row" align="start">
						{!isMobile && (
							<UsernameText smooth fontSize={16} spacing="ph2">
								{'https://memento.supply/'}
							</UsernameText>
						)}

						<UsernameTextInput
							suffix={
								!checkingAvailability &&
								onboardingFormData.handle.value &&
								onboardingFormData.handle.value != user?.handle ? (
									handleIsAvailable ? (
										<Box stacked="column" justify="center">
											<CheckmarkCircle size={18} color="var(--success-color)" />
										</Box>
									) : (
										<Box stacked="column" justify="center">
											<CloseCircle size={18} color="var(--danger-color)" />
										</Box>
									)
								) : null
							}
							maxLength={30}
							placeholder={user?.handle || 'username'}
							loading={checkingAvailability}
							onChange={onChangeText('handle')}
							value={onboardingFormData.handle.value}
							error={
								onboardingFormData.handle.value &&
								!handleIsAvailable &&
								onboardingFormData.handle.value != user?.handle
									? 'This username is taken'
									: onboardingFormData.handle.error
							}
						/>
					</UsernameBox>
				</FormGroup>

				<FormGroup>
					<Label>Bio</Label>
					<TextInput
						placeholder={user?.bio}
						elementType="textarea"
						error={onboardingFormData.bio.error}
						onChange={onChangeText('bio')}
						value={onboardingFormData.bio.value}
					/>
				</FormGroup>

				<Button
					width="100%"
					action={() => handleSubmitOnboardingForm()}
					text="Save"
					type="primary"
					loading={loading}
				/>
			</EditProfileCard>

			{/* <SkipContainer>
        <SkipButton onClick={handleSkip}>Skip for now</SkipButton>
      </SkipContainer> */}
		</PageContainer>
	)
}

export default OnboardingPage

const EditProfileCard = styled(Card)`
	max-width: 100%;
`
const Header = styled.div`
	align-items: center;
	display: flex;
	flex-direction: column;
	margin-bottom: 64px;
`

const Title = styled.div`
	font-size: 20px;
	font-weight: 600;
	margin-bottom: 8px;
`

const Subtitle = styled.div`
	color: ${getPaletteColor('text-muted')};
	font-size: 16px;
	font-weight: 500;
	margin-bottom: 40px;
`

const ProfileImage = styled.div`
	align-items: center;
	background: ${getPaletteColor('background')};
	border-radius: 100%;
	display: flex;
	cursor: pointer;
	justify-content: center;
	height: 104px;
	overflow: hidden;
	width: 104px;
	text-align: center;

	&:hover {
		background: ${getPaletteColor('canvas-bg')};
		border: 1px solid ${getPaletteColor('border-color')};
	}
`

const FormGroup = styled.div`
	margin-bottom: 24px;
`

const Label = styled.div`
	font-size: 16px;
	font-weight: 500;
	margin-bottom: 12px;
`

const ProfilePicImage = styled(Image)`
	border-radius: 100%;
	cursor: pointer;
`
const CameraIcon = styled(Camera)`
	color: ${getPaletteColor('text-muted')};
	height: 40px;
	width: 40px;
`
const Upload = styled.input`
	border-radius: 100%;
	position: absolute;
	height: 108px;
	width: 108px;
	top: 0;
	right: 0;
	cursor: pointer;
`

const UsernameBox = styled(Box)``

const UsernameText = styled(Text)`
	background: ${getPaletteColor('background')};
	color: ${getPaletteColor('text-muted')};
	font-size: 14px;
	font-weight: 500;
	height: 48px;
	border: 1px solid ${getPaletteColor('border-color')};
	border-right: none;
	line-height: 48px;
`

const UsernameTextInput = styled(TextInput)``

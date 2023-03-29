import styled from 'styled-components'

// Hooks
import { useCreate } from '@/hooks/useCreate'

// Components
import PageContainer from '@/components/PageContainer'
import Button from '@/components/Button'
import DatePicker from 'react-datepicker'
import { CreateButton } from '@/components/CreateButton'
import Image from '@/components/Image'

// Toast
import 'react-datepicker/dist/react-datepicker.css'
import { BeatLoader, ClipLoader } from 'react-spinners'
import { BigNumber } from 'ethers'
import { useUser } from '@/hooks/useUser'
import { useCallback, useMemo, useState } from 'react'

import {
	MEMENTO_FACTORY,
	MEMENTO_FACTORY_WITH_MAX_SUPPLY,
	MEMENTO_FACTORY_WITH_END_TIME,
	MEMENTO_FACTORY_WITH_MAX_SUPPLY_AND_END_TIME,
} from '@/constants/addresses'

import { handleAddress, handleAbi, handleFunctionName } from '@/lib/memento'
import {
	Box,
	getPaletteColor,
	Text,
	TextInput,
	Tooltip,
	UnstyledButton,
	useTheme,
} from '@/compound'
import { toNumber } from 'lodash'
import { CheckmarkCircle } from '@styled-icons/ionicons-solid'
import { FEATURE_CONFIG } from '@/lib/features'
import { Markdown } from '@/components/Markdown'

const MintPage = () => {
	const { user } = useUser()

	const {
		uploadImage,
		formData: {
			title: { value: title, error: titleError },
			price: { value: price, error: priceError },
			description: { value: description, error: descriptionError },
			numberOfEditions: {
				value: numberOfEditions,
				error: numberOfEditionsError,
			},
			uploadedImage: { value: uploadedImage, error: uploadedImageError },
			startDate: { value: startDate, error: startDateError },
			endDate: { value: endDate, error: endDateError },
			isImmediate: { value: isImmediate, error: isImmediateError },
			isUnlimited: { value: isUnlimited, error: isUnlimitedError },
			isOngoing: { value: isOngoing, error: isOngoingError },
		},
		isSubmitting,
		isUploading,
		createWithEoa,
		createWithEmail,
		media,
		paymentsEnabled,
		onSetupPayments,
		onChangeForm,
		isVerifyingMerchant,
	} = useCreate()

	const addressForCreateButton = useMemo(() => {
		return handleAddress(
			isOngoing ? undefined : endDate.getTime(),
			isUnlimited ? undefined : numberOfEditions
		)
	}, [isOngoing, isUnlimited, endDate, numberOfEditions])

	const abiForCreateButton = useMemo(() => {
		return handleAbi(addressForCreateButton)
	}, [addressForCreateButton])

	const functionNameForCreateButton = useMemo(() => {
		return handleFunctionName(
			isOngoing ? undefined : endDate.getTime(),
			isUnlimited ? undefined : numberOfEditions
		)
	}, [isOngoing, isUnlimited, endDate, numberOfEditions])

	const argsForCreateButton = useMemo(() => {
		switch (addressForCreateButton) {
			case MEMENTO_FACTORY:
				return [
					title,
					process.env.NEXT_PUBLIC_MEMENTO_SYMBOL_BASE,
					media,
					BigNumber.from(startDate.getTime()).div(1000),
					process.env.PUBLIC_ADDRESS ||
						'0x37909e961860E10de295F6a02AD1b834D00424Ce',
				]
			case MEMENTO_FACTORY_WITH_MAX_SUPPLY:
				return [
					title,
					process.env.NEXT_PUBLIC_MEMENTO_SYMBOL_BASE,
					media,
					BigNumber.from(startDate.getTime()).div(1000),
					process.env.PUBLIC_ADDRESS ||
						'0x37909e961860E10de295F6a02AD1b834D00424Ce',

					BigNumber.from(numberOfEditions),
				]
			case MEMENTO_FACTORY_WITH_END_TIME:
				return [
					title,
					process.env.NEXT_PUBLIC_MEMENTO_SYMBOL_BASE,
					media,
					BigNumber.from(startDate.getTime()).div(1000),
					process.env.PUBLIC_ADDRESS ||
						'0x37909e961860E10de295F6a02AD1b834D00424Ce',
					BigNumber.from(endDate.getTime()).div(1000),
				]
			case MEMENTO_FACTORY_WITH_MAX_SUPPLY_AND_END_TIME:
				return [
					title,
					process.env.NEXT_PUBLIC_MEMENTO_SYMBOL_BASE,
					media,
					BigNumber.from(startDate.getTime()).div(1000),
					process.env.PUBLIC_ADDRESS ||
						'0x37909e961860E10de295F6a02AD1b834D00424Ce',
					BigNumber.from(endDate.getTime()).div(1000),
					BigNumber.from(numberOfEditions),
				]
			default:
				return [
					title,
					process.env.NEXT_PUBLIC_MEMENTO_SYMBOL_BASE,
					media,
					BigNumber.from(startDate.getTime()).div(1000),
					process.env.PUBLIC_ADDRESS ||
						'0x37909e961860E10de295F6a02AD1b834D00424Ce',
					BigNumber.from(endDate.getTime()).div(1000),
					BigNumber.from(numberOfEditions),
				]
		}
	}, [
		addressForCreateButton,
		numberOfEditions,
		startDate,
		endDate,
		title,
		media,
	])

	const { theme, getPaletteColor } = useTheme()

	return (
		<PageContainer>
			<Title>Mint new</Title>
			<Card>
				<Box spacing="mb5">
					{uploadedImage ? (
						<ImageContainer>
							<Image
								src={uploadedImage}
								alt="Uploaded media asset"
								objectFit={'cover'}
							/>
						</ImageContainer>
					) : (
						<UploadImageContainer>
							<UploadImage
								type="file"
								name="file"
								id="file"
								onChange={uploadImage}
								accept="image/png, image/jpeg, video/*"
							/>
							{isUploading ? (
								<BeatLoader size={'8px'} color={'#b3b3b3'} />
							) : (
								'+ UPLOAD IMAGE OR VIDEO'
							)}
						</UploadImageContainer>
					)}
					{uploadedImageError && (
						<Text fontSize={14} fontColor="error-fg" spacing="mt1">
							{uploadedImageError}
						</Text>
					)}
				</Box>

				<FormGroup>
					<Label>Name</Label>
					<TextInput
						onChange={onChangeForm('title')}
						value={title}
						error={titleError}
					/>
				</FormGroup>

				<FormGroup>
					<Box stacked="row" justify="space-between">
						<Label>Description</Label>
					</Box>

					<TextInput
						elementType="textarea"
						onChange={onChangeForm('description')}
						value={description}
						error={descriptionError}
					/>
				</FormGroup>

				{FEATURE_CONFIG.paymentsEnabled && (
					<FormGroup>
						<Label>Price</Label>
						<Box stacked="row" gap="16px">
							<TextInput
								onChange={onChangeForm('price')}
								value={price}
								labelText="USD"
								type="number"
								error={priceError}
							/>
							{paymentsEnabled ? (
								<Box stacked="row" style={{ height: '56px' }} align="center">
									<Text fontSize={14} fontColor="text-muted">
										Merchant account verified
										<CheckmarkCircle
											size={14}
											color="var(--success-color)"
											style={{ marginTop: -2, marginLeft: 2 }}
										/>
									</Text>
								</Box>
							) : isVerifyingMerchant ? (
								<Box stacked="row" gap="6px">
									<Tooltip
										width="16px"
										text="This process usually takes between 1-3 minutes"
									/>
									<Text>
										Merchant verification in progress
										<ClipLoader
											size={14}
											speedMultiplier={0.85}
											color={getPaletteColor('text-muted')}
											cssOverride={{ marginBottom: -3, marginLeft: 2 }}
										/>
									</Text>
								</Box>
							) : (
								<Button
									onClick={onSetupPayments}
									text="Setup payments"
									type="secondary"
									height="48px"
								/>
							)}
						</Box>
					</FormGroup>
				)}

				<FormGroup>
					<LabelContainer>
						<Label>Supply</Label>
						<SupplyButton
							onClick={() => onChangeForm('isUnlimited')(!isUnlimited)}
						>
							{!isUnlimited ? 'Set unlimited' : 'Set fixed'}
						</SupplyButton>
					</LabelContainer>
					<EditionGroup>
						{!isUnlimited ? (
							<TextInput
								maxLength={16}
								placeholder="100"
								value={numberOfEditions.toString()}
								error={numberOfEditionsError}
								inputStyle={{
									textAlign: 'center',
									color: getPaletteColor('text-main'),
								}}
								onChange={(input) => {
									input
										? isNaN(toNumber(input))
											? onChangeForm('numberOfEditions')(numberOfEditions)
											: onChangeForm('numberOfEditions')(toNumber(input))
										: onChangeForm('numberOfEditions')(0)
								}}
							/>
						) : (
							<UnlimitedDisplay>Unlimited</UnlimitedDisplay>
						)}
					</EditionGroup>
				</FormGroup>

				<DateContainer>
					<DateGroup>
						<Label>Start date</Label>
						{isImmediate ? (
							<ImmediateDisplay
								onClick={() => onChangeForm('isImmediate')(false)}
							>
								Immediate
							</ImmediateDisplay>
						) : (
							<_DatePicker
								showTimeInput
								selected={startDate}
								onChange={(date) => {
									if (!date) return
									if (Array.isArray(date)) {
										const newDate = date[0]
										if (newDate) {
											onChangeForm('isImmediate')(false)
											onChangeForm('startDate')(newDate)
										}
									} else {
										onChangeForm('isImmediate')(false)
										onChangeForm('startDate')(date)
									}
								}}
								dateFormat="MMMM dd, yyyy"
							/>
						)}
						{startDateError && (
							<Text fontColor="error-fg" fontSize={14} spacing="mt1">
								{startDateError}
							</Text>
						)}
					</DateGroup>
				</DateContainer>
				<DateContainer>
					<DateGroup>
						<LabelContainer>
							<Label>End date</Label>
							<EndDateButton
								onClick={() => onChangeForm('isOngoing')(!isOngoing)}
							>
								{isOngoing ? 'Set fixed date' : 'Set ongoing'}
							</EndDateButton>
						</LabelContainer>
						{isOngoing ? (
							<OngoingDisplay>Ongoing</OngoingDisplay>
						) : (
							<_DatePicker
								showTimeInput
								selected={endDate}
								onChange={(date) => {
									if (!date) return
									if (Array.isArray(date)) {
										const newDate = date[0]
										if (newDate) {
											onChangeForm('endDate')(newDate)
										}
									} else {
										onChangeForm('isImmediate')(false)
										onChangeForm('endDate')(date)
									}
								}}
								dateFormat="MMMM dd, yyyy"
							/>
						)}
						{endDateError && (
							<Text fontColor="error-fg" fontSize={14} spacing="mt1">
								{endDateError}
							</Text>
						)}
					</DateGroup>
				</DateContainer>
				{user?.eoa && !user?.email ? (
					<CreateButton
						handleSuccess={createWithEoa}
						address={addressForCreateButton}
						abi={abiForCreateButton}
						functionName={functionNameForCreateButton}
						args={argsForCreateButton}
					/>
				) : (
					<Button
						text="Mint"
						type="primary"
						action={createWithEmail}
						disabled={isSubmitting || isUploading}
						loading={isSubmitting || isUploading}
					/>
				)}
			</Card>
		</PageContainer>
	)
}

export default MintPage

const Card = styled.div`
	background: ${getPaletteColor('card-bg')};
	border: 1px solid ${getPaletteColor('border-color-lighter')};
	padding: 24px 16px;
`

const Title = styled.div`
	font-size: 22px;
	font-weight: 600;
	height: 24px;
	margin-bottom: 24px;
`

const UploadImageContainer = styled.div`
	align-items: center;
	border: 1px dashed ${getPaletteColor('border-color')};
	color: ${getPaletteColor('text-muted')};
	cursor: pointer;
	display: flex;
	font-weight: 600;
	justify-content: center;
	height: 200px;
	position: relative;
	text-transform: uppercase;
	transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
	width: 100%;

	&:hover {
		border: 1px dashed ${getPaletteColor('border-color-hover')};
		color: ${getPaletteColor('text-main')};
	}
`
const UploadImage = styled.input`
	cursor: pointer;
	position: absolute;
	height: 200px;
	width: 100%;
`

const FormGroup = styled.div`
	margin-bottom: 40px;
`

const Label = styled.div`
	font-weight: 600;
	line-height: 16px;
	margin-bottom: 12px;
`

const EditionGroup = styled.div`
	display: flex;
	gap: 16px;
	width: 100%;
`

const DateContainer = styled.div`
	display: flex;
	gap: 16px;
	margin-bottom: 40px;
`

const DateGroup = styled.div`
	width: 100%;
`

const _DatePicker = styled(DatePicker)`
	background: ${getPaletteColor('text-input-bg-secondary')};
	border: 1px solid ${getPaletteColor('border-color')};
	color: ${getPaletteColor('text-main')};
	height: 48px;
	line-height: 48px;
	text-align: center;
	padding: 0px 16px;
	width: 100%;
`

const ImageContainer = styled.div`
	align-items: center;
	border: 1px solid ${getPaletteColor('border-color-lighter')};
	justify-content: center;
	position: relative;
	text-align: center;
`

const LabelContainer = styled.div`
	display: flex;
	justify-content: space-between;
`

const SupplyButton = styled.div`
	text-transform: uppercase;
	font-size: 12px;
	font-weight: 600;

	color: ${getPaletteColor('text-main')};
	cursor: pointer;
	line-height: 16px;
`
const UnlimitedDisplay = styled.div`
	align-items: center;
	background: ${getPaletteColor('text-input-bg-secondary')};
	border: 1px solid ${getPaletteColor('border-color')};
	color: ${getPaletteColor('text-main')};
	height: 48px;
	line-height: 48px;

	text-align: center;
	width: 100%;
`
const OngoingDisplay = styled.div`
	align-items: center;
	background: ${getPaletteColor('text-input-bg-secondary')};
	border: 1px solid ${getPaletteColor('border-color')};
	color: ${getPaletteColor('text-main')};
	height: 48px;
	line-height: 48px;

	text-align: center;
	width: 100%;
`
const EndDateButton = styled.div`
	text-transform: uppercase;
	font-size: 12px;
	font-weight: 600;

	color: ${getPaletteColor('text-main')};
	cursor: pointer;
	height: 16px;
	line-height: 16px;
`
const ImmediateDisplay = styled.div`
	align-items: center;
	background: ${getPaletteColor('text-input-bg-secondary')};
	border: 1px solid ${getPaletteColor('border-color')};
	color: ${getPaletteColor('text-main')};
	cursor: pointer;
	height: 48px;
	line-height: 48px;

	text-align: center;
	width: 100%;
`

const Preview = styled(Markdown)`
	min-height: 104px;
`

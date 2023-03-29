import { useOutsideClick } from '../../hooks/index'
import { useBreakPoint } from '@/compound/themes'
import { UnstyledButton } from '../../behaviours/unstyled-button/unstyled-button.component'
import { DropdownItemProps, DropdownProps } from './dropdown.proptypes'
import React, { forwardRef, LegacyRef, RefObject, useMemo, useRef } from 'react'
import { BreakPoint } from '../../utils/breakpoints'
import {
	MenuItem,
	SelectedField,
	DownArrowIcon,
	EllipsesIcon,
	BurgerIcon,
	FullScreenMenuContent,
	MenuContent,
	CloseIcon,
	DropdownContainer,
	SearchIcon,
	PowerIcon,
} from './dropdown.css-rules'
import { css } from 'styled-components'

export const DropdownItem = ({ text, onClick }: DropdownItemProps) => {
	return <MenuItem onClick={onClick}>{text}</MenuItem>
}

const SelectedFieldIcon = ({
	icon,
	open,
	size,
}: {
	icon: DropdownProps['selectedFieldIcon']
	open: boolean
	size: string
}) => {
	return icon === 'arrow' ? (
		<DownArrowIcon open={open} size={size} />
	) : (
		<PowerIcon size={size} />
	)
}

const DropdownToggle = forwardRef(
	(
		{
			type,
			breakpoint,
			title,
			open,
			iconStyles,
			selectedFieldStyles,
			selectedFieldIcon,
		}: Pick<
			DropdownProps,
			| 'type'
			| 'title'
			| 'iconStyles'
			| 'selectedFieldStyles'
			| 'selectedFieldIcon'
		> & {
			breakpoint: BreakPoint
			open: boolean
			ref: RefObject<HTMLElement | undefined>
		},
		ref
	) => {
		let resolvedType: DropdownProps['type']

		if (typeof type === 'object') {
			resolvedType = type[breakpoint]
		} else {
			resolvedType = type
		}

		const customStyles =
			resolvedType === 'title' && selectedFieldStyles
				? css(selectedFieldStyles).join('')
				: ''

		return (
			<div ref={ref as any}>
				{title && resolvedType === 'title' && (
					<SelectedField customStyles={customStyles}>
						{title}
						<SelectedFieldIcon icon={selectedFieldIcon} open={open} size="16" />
					</SelectedField>
				)}

				{resolvedType === 'ellipses' && (
					<EllipsesIcon customStyles={iconStyles} />
				)}
				{resolvedType === 'search' && <SearchIcon customStyles={iconStyles} />}
				{resolvedType === 'burger' && <BurgerIcon customStyles={iconStyles} />}
			</div>
		)
	}
)

DropdownToggle.displayName = 'DropdownToggle'

export const Dropdown = ({
	type = 'title',
	children,
	alignment = 'left',
	title,
	open,
	onClose,
	onOpen,
	iconStyles,
	selectedFieldStyles,
	selectedFieldIcon = 'arrow',
	dropdownOffset = 65,
}: DropdownProps) => {
	const breakpoint = useBreakPoint()

	const dropdownContentRef = useRef<HTMLDivElement>(null)

	const justifyValue = useMemo(
		() => (alignment === 'left' ? 'start' : 'end'),
		[alignment]
	)
	const toggleButtonRef = useRef<HTMLElement>()

	useOutsideClick(dropdownContentRef, onClose)

	const MenuComponent = useMemo(
		() => (breakpoint === 'mobile' ? FullScreenMenuContent : MenuContent),
		[breakpoint]
	)

	return (
		<DropdownContainer
			stacked="row"
			ref={dropdownContentRef}
			justify={justifyValue}
		>
			<UnstyledButton onClick={open ? onClose : onOpen}>
				<DropdownToggle
					title={title}
					type={type}
					breakpoint={breakpoint}
					open={open}
					iconStyles={iconStyles}
					selectedFieldStyles={selectedFieldStyles}
					selectedFieldIcon={selectedFieldIcon}
					ref={toggleButtonRef}
				/>
			</UnstyledButton>
			{open && (
				<MenuComponent stacked="column" dropdownOffset={dropdownOffset}>
					{breakpoint === 'mobile' && (
						<UnstyledButton onClick={onClose} stacked="row" justify="end">
							<CloseIcon />
						</UnstyledButton>
					)}
					{children}
				</MenuComponent>
			)}
		</DropdownContainer>
	)
}

import type { StackeeProps } from '../../mixins/stackee/stackee.proptypes'
import type { StackerProps } from './../../mixins/stacker/stacker.proptypes'
import type { ContainerProps } from '../../mixins/container/container.proptypes'
import {
	getStackeeRules,
	getStackerRules,
	getSpacingRules,
	SpaceProps,
} from '../../mixins'
import styled from 'styled-components'
import React, { ReactComponentElement, useMemo } from 'react'
import { UnstyledButton } from '../../behaviours/unstyled-button/unstyled-button.component'
import { getPaletteColor } from '@/compound/themes'

interface CardProps
	extends ContainerProps,
		StackeeProps,
		StackerProps,
		SpaceProps {
	backgroundColor?: string
	className?: string
	ref?: any
	onClick?: () => void
	target?: HTMLAnchorElement['target']
	href?: string
}

export const Card = React.forwardRef<any, CardProps>(
	({ children, ...props }, ref) => {
		const ContainerComponent: React.FC<CardProps> = useMemo(() => {
			return props.href || props.onClick ? CardButtonContainer : CardContainer
		}, [props.onClick, props.href])

		return (
			<ContainerComponent ref={ref} {...props}>
				{children}
			</ContainerComponent>
		)
	}
)

Card.displayName = 'Card'

const CardContainer = styled.div<Omit<CardProps, 'children'>>`
	${getStackeeRules}
	${getStackerRules}
	${getSpacingRules}

border-radius: var(--card-border-radius);
	border: 1px solid ${getPaletteColor('border-color')};
	background: ${({ backgroundColor }) =>
		backgroundColor ? backgroundColor : getPaletteColor('card-bg')};
	position: relative;
	overflow: hidden;
`

const CardButtonContainer = styled(UnstyledButton)<Omit<CardProps, 'children'>>`
	${getStackeeRules}
	${getStackerRules}
	${getSpacingRules}

	border-radius: var(--card-border-radius);
	border: 1px solid ${getPaletteColor('border-color')};
	background: ${({ backgroundColor }) =>
		backgroundColor ? backgroundColor : getPaletteColor('card-bg')};
	position: relative;
	overflow: hidden;
`

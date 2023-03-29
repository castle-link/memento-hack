import React, { forwardRef, RefObject } from 'react'
import styled from 'styled-components'
import type { UnstyledButtonProps } from './unstyled-button.proptypes'
import { commonStyles } from './unstyled-button.css-rules'
import { omit } from 'lodash'

const ActualUnstyledButton = styled.button<UnstyledButtonProps>`
	${commonStyles}
`

const UnstyledLink = styled.a<UnstyledButtonProps>`
	${commonStyles}
	display: inline-block;

	&,
	&:hover {
		text-decoration: none;
	}
`

export const UnstyledButton = forwardRef<HTMLElement, UnstyledButtonProps>(
	(
		{ href, target, onClick, type, disabled, ...props }: UnstyledButtonProps,
		ref
	) =>
		href == null ? (
			<ActualUnstyledButton
				onClick={onClick}
				type={type ?? 'button'}
				{...omit(props, ['loading'])}
				ref={ref as RefObject<HTMLButtonElement>}
				disabled={disabled}
			/>
		) : (
			<UnstyledLink
				href={href}
				target={target}
				rel={target?.length ? 'noreferrer noopener' : undefined}
				onClick={onClick}
				{...omit(props, ['loading'])}
				ref={ref as RefObject<HTMLAnchorElement>}
			/>
		)
)

UnstyledButton.displayName = 'UnstyledButton'

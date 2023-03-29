import { CSSProperties } from 'react'
import { CSSObject, CSSProp } from 'styled-components'

type Placement = 'left' | 'right' | 'bottom' | 'top'
export interface TooltipProps {
	text: string
	placement?: Placement
	fallbackPlacements?: Placement[]
	children?: React.ReactNode
	height?: string
	width?: string
	buttonStyles?: CSSObject
	iconStyles?: CSSObject
	icon?: 'information-circle' | 'information-circle-outline'
	allowOverflow?: boolean
	customPopperStyles?: CSSProperties
}

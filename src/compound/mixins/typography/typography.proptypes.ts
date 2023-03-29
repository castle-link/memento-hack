import { ColorPaletteKey } from '@/compound/themes'
import { FontSizeKey } from '@/compound/themes/font-size'

type Alignment = 'left' | 'center' | 'right'
export interface TypographyProps {
	medium?: boolean
	bold?: boolean
	fontSize?: FontSizeKey | number
	align?: Alignment
	fontColor?: ColorPaletteKey
	lineHeight?: string
	nowrap?: boolean
	ellipsis?: boolean
	smooth?: boolean
}

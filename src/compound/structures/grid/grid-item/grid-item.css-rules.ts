import { GridItemProps } from './grid-item.proptypes'
import {
	numColsSm,
	numColsMd,
	numColsLg,
	numColsXl,
} from './grid-item.constants'

export const widthSm = ({ sm, offsetSm = 0 }: GridItemProps) =>
	sm != null && sm !== 'hide'
		? `${((sm + offsetSm) * 100) / numColsSm}%`
		: undefined

export const widthMd = ({ sm, md, offsetMd = 0 }: GridItemProps) => {
	const colCount = md || sm
	return colCount != null && colCount !== 'hide'
		? `${((colCount + offsetMd) * 100) / numColsMd}%`
		: undefined
}

export const widthLg = ({ sm, md, lg, offsetLg = 0 }: GridItemProps) => {
	const colCount = lg || md || sm
	return colCount != null && colCount !== 'hide'
		? `${((colCount + offsetLg) * 100) / numColsLg}%`
		: undefined
}

export const widthXl = ({ sm, md, lg, xl, offsetXl = 0 }: GridItemProps) => {
	const colCount = xl || lg || md || sm
	return colCount != null && colCount !== 'hide'
		? `${((colCount + offsetXl) * 100) / numColsXl}%`
		: undefined
}

export const paddingLeftSm = ({ offsetSm = 0 }: { offsetSm?: number }) =>
	`${(offsetSm * 100) / numColsSm}%`
export const paddingLeftMd = ({ offsetMd = 0 }: { offsetMd?: number }) =>
	`${(offsetMd * 100) / numColsMd}%`
export const paddingLeftLg = ({ offsetLg = 0 }: { offsetLg?: number }) =>
	`${(offsetLg * 100) / numColsLg}%`
export const paddingLeftXl = ({ offsetXl = 0 }: { offsetXl?: number }) =>
	`${(offsetXl * 100) / numColsLg}%`

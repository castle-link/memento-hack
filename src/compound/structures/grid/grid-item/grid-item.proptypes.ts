import { ContainerProps } from '../../../mixins/container'
import { StackerProps } from '../../../mixins/stacker'

type BaseColumnNumbers = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
type SmallColumnNumbers = BaseColumnNumbers
type MediumColumnNumbers = BaseColumnNumbers
type LargeColumnNumbers = BaseColumnNumbers
type ExtraLargeColumnNumbers = BaseColumnNumbers

export interface GridItemProps extends ContainerProps, StackerProps {
	sm: 'hide' | SmallColumnNumbers
	md?: 'hide' | MediumColumnNumbers
	lg?: 'hide' | LargeColumnNumbers
	xl?: 'hide' | BaseColumnNumbers
	offsetSm?: 0 | SmallColumnNumbers
	offsetMd?: 0 | MediumColumnNumbers
	offsetLg?: 0 | LargeColumnNumbers
	offsetXl?: 0 | ExtraLargeColumnNumbers
}

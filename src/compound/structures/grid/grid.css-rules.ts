import { SPACING } from '../../themes/spacing'
import { GridProps } from './grid.proptypes'

export const gutterSize = ({ gutter = 's3' }: GridProps) => SPACING[gutter]

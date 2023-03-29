import styled from 'styled-components'

// Icons
import { Square } from '@styled-icons/ionicons-outline'
import { Square as FilledSqaure } from '@styled-icons/ionicons-solid'
import { Checkbox as _Checkbox } from '@styled-icons/ionicons-solid'
import { UnstyledButton } from '../..'
import { noop } from 'lodash'

export const Checkbox = ({
	selected,
	locked = false,
	size = 18,
	onClick,
}: {
	selected: boolean
	locked?: boolean
	size?: number
	onClick?: () => void
}) => {
	return (
		<UnstyledButton onClick={onClick ? onClick : noop}>
			{selected ? (
				<CheckboxIcon locked={locked} size={size} />
			) : locked ? (
				<FilledSqaureIcon size={size} />
			) : (
				<SquareIcon size={size} />
			)}
		</UnstyledButton>
	)
}

const SquareIcon = styled(Square)`
	color: rgba(255, 255, 255, 0.6);
	transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
`

const FilledSqaureIcon = styled(FilledSqaure)`
	color: rgba(255, 255, 255, 0.6);
	transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
`

const CheckboxIcon = styled(_Checkbox)<{ locked: boolean }>`
	color: ${({ locked }) =>
		locked ? 'rgba(255, 255, 255, 0.6)' : 'rgb(28, 176, 255)'};
	transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
`

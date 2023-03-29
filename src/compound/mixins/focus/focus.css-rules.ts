import { FocusStateOptions } from './focus.proptypes'

export const focusedCircleRadius = '50%'
export const transitionInstant = '0s'
export const transitionFade = 'all 100ms linear'

export const getBaseFocusState = ({
	baseTransition = true,
	hoverTransition = true,
	activeTransition = true,
	pointerCursor = true,
}: FocusStateOptions) => `
  outline: none;
  box-shadow: initial;
  ${baseTransition ? `transition: ${transitionFade};` : ''}
  &:not([disabled]) {
    &:hover {
      ${pointerCursor ? 'cursor: pointer;' : ''}
      ${hoverTransition ? `transition: ${transitionInstant};` : ''}
    }
    &:active {
      ${activeTransition ? `transition: ${transitionInstant};` : ''}
    }
  }
  &[disabled] {
    cursor: default;
  }
`

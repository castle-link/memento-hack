import { BreakPoint } from '../../utils/breakpoints'

export interface StackeeOptions {
	grow?: number | null
	shrink?: number | null
	basis?: number
}

export interface StackeeProps {
	grow?:
		| number
		| {
				[k in BreakPoint]?: number
		  }
	shrink?:
		| number
		| {
				[k in BreakPoint]?: number
		  }
	basis?:
		| number
		| {
				[k in BreakPoint]?: number
		  }
}

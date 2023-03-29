import { Tooltip } from './tooltip.component'

export default {
	title: 'Overlays/Tooltip',
	component: Tooltip,
}

export const Default = () => {
	return <Tooltip text="This is a tooltip" />
}

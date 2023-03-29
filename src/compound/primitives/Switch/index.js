export const Switch = ({ selected, action }) => {
	return (
		<label className="switch">
			<input type="checkbox" checked={selected} onChange={action} />
			<span className="slider round"></span>
		</label>
	)
}

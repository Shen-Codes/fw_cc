import React from 'react'

const Table = ({state, setState}) => {
	const tableData = state;

	const handleDelete = i => {
		tableData.splice(i, 1);
		setState(tableData);
	}

	return (
		<div>
			<table>
				<tr>
					<th>Description</th>
					<th>Type</th>
					<th>Amount</th>
				</tr>
				{
					tableData.map((line, i) => {
						<tr key={i}>
							<td>{line.description}</td>
							<td>{line.type}</td>
							<td>{line.amount}</td>
							<td><button onClick={() => handleDelete(i)}>x</button></td>
						</tr>
					})
				}
			</table>
		</div>
	)
}

export default Table

import React from 'react'

const Table = () => {
	const tableData = [
		{
			description: "burger",
			type: "asset",
			amount: 10
		},
		{
			description: "burger",
			type: "asset",
			amount: 10
		},
		{
			description: "burger",
			type: "asset",
			amount: 10
		},
		{
			description: "burger",
			type: "asset",
			amount: 10
		},
	]


	const handleDelete = i => {
		tableData.splice(i, 1);
		console.log(tableData)
	}

	return (
		<div>
			<table>
				<thead>
					<tr>
						<th>Description</th>
						<th>Type</th>
						<th>Amount</th>
					</tr>
				</thead>
				<tbody>
					{
						tableData.map((line, i) => {
							return(
								<tr key={i}>
									<td>{line.description}</td>
									<td>{line.type}</td>
									<td>{line.amount}</td>
									<td><button onClick={() => handleDelete(i)}>x</button></td>
								</tr>
							)
						})
					}
				</tbody>
			</table>
		</div>
	)
}

export default Table

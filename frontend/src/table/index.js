import React, { useState } from 'react'
import { DeleteRequest, GetRequest} from '../api/apis';

const Table = () => {
	const [table, setTable] = useState([]);

	const handleDelete = (id, e) => {
		e.preventDefault();
		data = DeleteRequest(id, "localhost:5000/");
		handleRefresh();
	}

	const handleRefresh = e => {
		e.preventDefault();
		data = GetRequest("localhost:5000/");
		setTable(data);
	}

	return (
		<div>
			<button onClick={handleRefresh}>Refresh</button>
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
						table.map((line, i) => {
							return(
								<tr key={line.id}>
									<td>{line.description}</td>
									<td>{line.type}</td>
									<td>{line.amount}</td>
									<td><button onClick={() => handleDelete(line.id)}>x</button></td>
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

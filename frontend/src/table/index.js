import React, { useEffect, useState } from 'react'
import { DeleteRequest, GetRequest} from '../api/apis';
import './Table.css'

const Table = () => {
	const [table, setTable] = useState([
		{
			id: 0,
			description: "total",
			transactiontype: "neither",
			amount: 0
		},
		{
			id: 0,
			description: "assets",
			transactiontype: "neither",
			amount: 0
		},
		{
			id: 0,
			description: "liabilities",
			transactiontype: "neither",
			amount: 0
		},
	]);

	useEffect(() =>{
		//not sure what race conditions are, but the warning said do it like this to prevent it
		const fetchData = async () => {
			await GetRequest("http://localhost:5000/")
			.then(response => setTable(response))
		};
		fetchData();
	}, []);

	const handleDelete = async (item, e) => {
		e.preventDefault();
		
		await DeleteRequest(item, "http://localhost:5000/")
		.then(response => setTable(response))
	}

	const handleRefresh = async e => {
		e.preventDefault();
		await GetRequest("http://localhost:5000/")
			.then(response => setTable(response))
	}

	const total = table.filter(item => item.description === "total");
	const assets = table.filter(item => item.description === "assets");
	const liabilities = table.filter(item => item.description === "liabilities");

	return (
		<div >
			<div id="table">
				<table>
					<thead>
						<tr>
							<th>Total Assets -</th>
							<th>Total Liabilites</th>
							<th>Total Wealth</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>{assets[0].amount}</td>
							<td>{liabilities[0].amount}</td>
							<td>{total[0].amount}</td>
						</tr>
						
					</tbody>
				</table>
				<button id="refresh-button" onClick={handleRefresh}>Refresh</button>
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
							table.map((item, i) => {
								if (item.description === "total" || item.description === "assets" || item.description === "assets"){
									return
								}
								return(
									<tr key={item.id}>
										<td>{item.description}</td>
										<td>{item.transactiontype}</td>
										<td>{item.amount}</td>
										<td><button onClick={(e) => handleDelete(item, e)}>x</button></td>
									</tr>
								)
							})
						}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default Table

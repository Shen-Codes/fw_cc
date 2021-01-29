import React, { useContext} from 'react'
import { DeleteRequest, GetRequest} from '../api/apis';
import { TableContext } from '../app';
import './Table.css'


const Table = () => {

	const {table, sendRequest, changeHandler} = useContext(TableContext)


	const total = (table || []).filter(item => item.description === "total");
	const assets = (table || []).filter(item => item.description === "assets");
	const liabilities = (table || []).filter(item => item.description === "liabilities");

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
							<td>{assets[0].amount || 0}</td>
							<td>{liabilities[0].amount || 0}</td>
							<td>{total[0].amount || 0}</td>
						</tr>
						
					</tbody>
				</table>
				<button id="refresh-button" onClick={() => sendRequest(null, "GET")}>Refresh</button>
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
							(table || []).map((item, i) => {
								if (item.description === "total" || item.description === "assets" || item.description === "liabilities"){
									return
								}
								return(
									<tr key={item.id}>
										<td>{item.description}</td>
										<td>{item.transactiontype}</td>
										<td>{item.amount}</td>
										<td><button onClick={console.log(item)}>edit</button></td>
										<td><button onClick={() => sendRequest(item.id, "DELETE")}>x</button></td>
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

import React, { useContext, useEffect} from 'react'
import { Request } from '../api/apis';
import { TableContext } from '../context/tablecontext';
import './Table.css'


const Table = () => {	
	const {table: {table}, setTable} = useContext(TableContext)

	useEffect(() => {		
		Request(null, "GET")
			.then(data => setTable(data))
	}, [])

	const deleteItem = (id, e) => {
		e.preventDefault();
		Request(id, "DELETE").then(data => setTable(data))
	}

	const total = (table).filter(item => item.description === "total")
	const assets = (table).filter(item => item.description === "assets") 
	const liabilities = (table).filter(item => item.description === "liabilities")

	return (
		<div >
			<div id="table">
				<table>
					<thead>
						<tr>
							<th>Total Assets</th>
							<th>Total Liabilites</th>
							<th>Total Wealth</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>{assets[0] ?  assets[0].amount : 0}</td>
							<td>{liabilities[0] ? liabilities[0].amount : 0}</td>
							<td>{total[0] ? total[0].amount : 0}</td>
						</tr>
						
					</tbody>
				</table>
				<button id="refresh-button" onClick={() => Request(null, "GET")}>Refresh</button>
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
									return null;
								}
								return(
									<tr key={item.id}>
										<td>{item.description}</td>
										<td>{item.transactiontype}</td>
										<td>{item.amount}</td>
										<td><button onClick={() => console.log(item)}>edit</button></td>
										<td><button onClick={(e) => deleteItem(item.id, e)}>x</button></td>
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

import React, { useContext} from 'react'
import { Request } from '../api/apis'
import { TableContext } from '../context/tablecontext'
import './Form.css'


const Form = () => {
	const {table, setTable, changeHandler} = useContext(TableContext)

	const postAndSet = () => {
		Request(table.form, "POST").then(data => setTable(data))
	}

	return (
		<div id="form">
			<form onSubmit={postAndSet}>
				<label>
					Description:
					<input 
						type="text" 
						value={table.form.description} 
						onChange={(e) => changeHandler("form", "form", e)}
						name="description"
						required
					/>
				</label>
				<label>
					Type:
					<select value={table.form.transactiontype} onChange={(e) => changeHandler("form","form", e)} name="transactiontype">
						<option value="asset">Asset</option>
						<option value="liability">Liability</option>
					</select>
				</label>
				<label>
					Amount:
					<input 
						type="text" 
						value={table.form.amount} 
						onChange={(e) => changeHandler("form","form", e)}
						name="amount"
						required
					/>
				</label>
				<button onSubmit={postAndSet}>Submit</button>
			</form>
		</div>
	)
}

export default Form;

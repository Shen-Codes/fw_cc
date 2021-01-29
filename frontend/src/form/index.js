import React, { useContext} from 'react'
import { TableContext } from '../context/tablecontext'
import './Form.css'


const Form = () => {
	const {table, sendRequest, changeHandler} = useContext(TableContext)

	return (
		<div id="form">
			<form onSubmit={handleSubmit}>
				<label>
					Description:
					<input 
						type="text" 
						value={table.form.description} 
						onChange={() => changeHandler("form", e)}
						name="description"
						required
					/>
				</label>
				<label>
					Type:
					<select value={form.transactiontype} onChange={() => changeHandler("form","form", e)} name="transactiontype">
						<option value="asset">Asset</option>
						<option value="liability">Liability</option>
					</select>
				</label>
				<label>
					Amount:
					<input 
						type="text" 
						value={form.amount} 
						onChange={() => changeHandler("form","form", e)}
						name="amount"
						required
					/>
					{!form.isNum && <span>must be a number</span> }
				</label>
				<button onSubmit={() => sendRequest(table.form, "POST")}>Submit</button>
			</form>
		</div>
	)
}

export default Form;

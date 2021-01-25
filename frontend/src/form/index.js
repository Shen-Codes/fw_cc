import React, { useState } from 'react'
import { GetRequest, PostRequest } from '../api/apis'

const initialState = {
	id: 0,
	description: "",
	type: "asset",
	amount: 0,
	isNum: true,
}

const Form = () => {
	const [form, setForm] = useState(initialState)

	const handleChange = e => {
		e.preventDefault();
		let {name, value} = e.target;
	
		setForm(prevState => {
			if(isNaN(value) && name === "amount"){
				return {
					...prevState,
					[name]: value,
					isNum: false
				}
			} else if (!isNaN(value) && name === "amount"){
				return {
					...prevState,
					[name]: value,
					isNum: true
				}
			}
			return {
				...prevState,
				[name]: value
			}
		});
	}

	const handleSubmit = e => {
		e.preventDefault();
		transaction = form;
		data = GetRequest("localhost:5000/")
		PostRequest(transaction, "localhost:5000/")
	}
	
	return (
		<div>
			<form onSubmit={handleSubmit}>
				<label>
					Description:
					<input 
						type="text" 
						value={form.description} 
						onChange={handleChange}
						name="description"
						required
					/>
				</label>
				<label>
					Type:
					<select value={form.type} onChange={handleChange} name="type">
						<option value="asset">Asset</option>
						<option value="liability">Liability</option>
					</select>
				</label>
				<label>
					Amount:
					<input 
						type="text" 
						value={form.amount} 
						onChange={handleChange}
						name="amount"
						required
					/>
					{!form.isNum && <span>must be a number</span> }
				</label>
				<button onSubmit={handleSubmit}>Submit</button>
			</form>
		</div>
	)
}

export default Form;

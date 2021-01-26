import React, { useState } from 'react'
import { GetRequest, PostRequest } from '../api/apis'
import './Form.css'

const initialState = {
	description: "",
	transactiontype: "asset",
	amount: 0,
	isNum: true,
}

const url = "http://FwCc-env.eba-qt7cuybt.us-east-1.elasticbeanstalk.com/";
const localhost = "http://localhost:5000/";

const Form = () => {
	const [form, setForm] = useState(initialState)

	const handleChange = e => {
		e.preventDefault();
		let {name, value} = e.target;
	
		setForm(prevState => {
			//some simple form validation
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

	const handleSubmit = async e => {
		e.preventDefault();
		let transaction = form;
		//remove is num so as not to post as a property
		delete transaction.isNum;
		let length;
		//current kludgy way of getting an id, plan on implementing uuid in next iteration
		await GetRequest("url")
		.then(result => {
			length = parseInt(Math.max(...result.map(item => item.id)))
		})
	

		transaction = {
			id: length + 1,
			...transaction,
			//need to parse to int since backend takes int type on amount property of transaction struct
			amount: parseInt(transaction.amount)
		}

		await PostRequest(transaction, "url")
		setForm(initialState)
	}
	
	return (
		<div id="form">
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
					<select value={form.transactiontype} onChange={handleChange} name="transactiontype">
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

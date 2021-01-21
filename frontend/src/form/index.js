import React, { useState } from 'react'

const Form = ({state, setState}) => {
	const [form, setForm] = useState({
		description: "",
		type: "",
		amount: 0
	})

	const handleChange = e => {
		e.preventDefault();
		const {name, value} = e.target;
		setForm(prevState => ({
			...prevState,
			[name]: value
		}));
	}

	const handleSubmit = e => {
		e.preventDefault();
		const newState = state;
		newState.push(form);
		setState(newState);
	}
	
	return (
		<div>
			<form onsubmit={handleSubmit}>
				<label>
					Description:
					<input 
						type="text" 
						value={form.description} 
						onChange={handleChange}
						name="description"
					/>
				</label>
				<label>
					Type:
					<select value={form.type} onChange={handleChange}>
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
					/>
				</label>
			</form>
		</div>
	)
}

export default Form;

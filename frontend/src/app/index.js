import React from 'react'
import Form from '../form'
import Table from '../table'
import { GetId } from '../utils/getid';


const App = () => {
	let id = 0;
	GetId;
	return (
		<div>
			<Form />
			<Table />
		</div>
	)
}

export default App


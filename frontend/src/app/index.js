import React from 'react'
import Form from '../form'
import Table from '../table'
import { TableContext } from '../context/tablecontext'


const App = () => {
	return (
		<div>
			<TableContext>
				<Form />
				<Table />
			</TableContext>
		</div>
	);
}

export default App
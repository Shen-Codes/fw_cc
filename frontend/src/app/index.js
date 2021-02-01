import React from 'react'
import Form from '../form'
import Table from '../table'
import { TableContextComp } from '../context/tablecontext'


const App = () => {
	return (
		<div>
			<TableContextComp>
				<Form />
				<Table />
			</TableContextComp>
		</div>
	);
}

export default App
import React, {useState} from 'react'
import Form from '../form'
import Table from '../table'

const initialState = [{}];

const App = () => {
	const [state, setState] = useState(initialState);

	return (
		<div>
			<Form state={state} setState={setState} />
			<Table state={state} setState={setState}/>
		</div>
	)
}

export default App


import React, {createContext, useEffect, useReducer} from 'react';
import { CHANGE_HANDLER, SEND_REQUEST } from '../constants/constants';
import { reducer } from './reducer';

const TableContext = createContext();

const initialState = {
	form: {
		description: "",
		transactiontype: "asset",
		amount: 0,
		isNum: true,
	},
	table: []
};

export const TableContext = props => {

	const [table, dispatch] = useReducer(reducer, initialState)

	useEffect(() => {
		dispatch({
			type: SEND_REQUEST,
			method: "GET",
		})
	}, [])

	const sendRequest = (method, transaction) => {
		dispatch({
			type: SEND_REQUEST,
			method: `${method}`,
			payload: transaction
		})
	}

	const changeHandler = (tableProp, id, e)=> {
		e.preventDefault();
		const name = e.target.name;
		const value = e.target.value;
		dispatch({
			type: CHANGE_HANDLER,
			id: id,
			name: name,
			value: value,
			tableProp, tableProp
		})	
	}


	return(
		<TableContext.Provider value={{
			table: table,
			sendRequest: sendRequest,
			changeHandler: changeHandler
		}}>
			{props.children}
		</TableContext.Provider>
	)
}
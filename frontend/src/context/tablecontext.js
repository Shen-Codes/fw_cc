import React, {createContext,useReducer} from 'react';
import { CHANGE_HANDLER, SET_TABLE } from '../constants/constants';
import { reducer } from './reducer';

export const TableContext = createContext();

const initialState = {
	form: {
		description: "",
		transactiontype: "asset",
		amount: 0,
		isNum: true,
	},
	table: []
};

export const TableContextComp = props => {

	const [table, dispatch] = useReducer(reducer, initialState)

	const setTable = table => {
		dispatch({
			type: SET_TABLE,
			payload: table,
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
			tableProp: tableProp
		})	
	}


	return(
		<TableContext.Provider value={{
			table: table,
			setTable: setTable,
			changeHandler: changeHandler
		}}>
			{props.children}
		</TableContext.Provider>
	)
}
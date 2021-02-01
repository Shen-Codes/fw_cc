
import { CHANGE_HANDLER,  SET_TABLE } from "../constants/constants";


const setTable = (payload, state) => {	
	console.log(payload, state)
	
	return {
		...state,
		table: payload
	}
}

const changeHandler = ({tableProp, id, name, value}, state) => {

	if (tableProp === "form") {
		value = name === "amount" ? value = parseInt(value) : value
		console.log(typeof(value))
		return {
			...state,
			form: {
				...state.form,
				[name]: value
			}
		}
	} else {
		const table = state.table.map(item => {
			if(item.id === id){
				return {
					...item,
					[name]: value
				}
			} else {
					return item
				}
		})

		return {
			...state,
			table: [...table]
		}
	}
}

export const reducer = (state, action) => {
	switch(action.type) {
		case SET_TABLE:
			return setTable(action.payload, state)
		case CHANGE_HANDLER:
			return changeHandler(action, state)
		default:
			return;
	}
}



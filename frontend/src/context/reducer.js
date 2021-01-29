import { Request } from "../api/apis";


const request = async (transaction, method, state) => {
	const table = await Request(transaction, method).then(response => response);
	return {
		...state,
		table: table
	}
}

const changeHandler = ({tableProp, id, name, value}, state) => {

	if (tableProp = "form") {
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
					return;
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
		case SEND_REQUEST:
			return request(action.payload)
		case CHANGE_HANDLER:
			return changeHandler(action, state)
		default:
			return;
	}
}



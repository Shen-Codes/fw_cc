import { url } from "../constants/constants";

export const Request = async (item, method) => {
	const requestOptions = {
		method: `${method}`,
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(item)
	}
	
	const response = await fetch(url, requestOptions);
	const data = response.json();
	return data
}

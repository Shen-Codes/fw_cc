import { url } from "../constants/constants";

export const Request = async (item, method) => {
	const requestOptions = {
		method: `${method}`,
		headers: {'Content-Type': 'application/json'},
		...(method !== "GET" && {body: JSON.stringify(item)})
	}
	console.log(requestOptions)
	const response = await fetch(url, requestOptions)
	const data = response.json()

	return data;
}
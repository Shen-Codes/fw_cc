export const PostRequest = async (transaction, url) => {
	const requestOptions = {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(transaction)
	};
	const response = await fetch(url, requestOptions);
	const data = response.json();
	return data
}

export const GetRequest = async (url) => {
	const response = await fetch(url);
	const data = response.json();
	return data;
}

export const DeleteRequest = async (id, url) => {
	const requestOptions = {
		method: 'DELETE',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(id)
	}
	const response = await fetch(url, requestOptions);
	const data = response.json();
	return data
}
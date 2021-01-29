
//from reducers.js

// const getTable = async (state) => {
// 	const table = await GetRequest().then(response => response);
// 	return table;
// };

// const submitItem = async (transaction) => {
// 	const table = await PostRequest(transaction).then(response => response);
// 	return table;
// };

// const deleteItem = async (id) => {
// 	const table = await DeleteRequest(id).then(response => response);
// 	return table
// }

// const updateItem = async(transaction) => {
// 	const table = await DeleteRequest(id).then(response => response);
// 	return table
// }


//from apis.js


// export const PostRequest = async (transaction) => {
// 	const requestOptions = {
// 		method: 'POST',
// 		headers: {'Content-Type': 'application/json'},
// 		body: JSON.stringify(transaction)
// 	};
// 	const response = await fetch(url, requestOptions);
// 	const data = response.json();
// 	return data
// }

// export const GetRequest = async () => {
// 	const response = await fetch(url);
// 	const data = response.json();
// 	return data;
// }

// export const DeleteRequest = async (id) => {
// 	const requestOptions = {
// 		method: 'DELETE',
// 		headers: {'Content-Type': 'application/json'},
// 		body: JSON.stringify(id)
// 	}
// 	const response = await fetch(url, requestOptions);
// 	const data = response.json();
// 	return data
// }

// export const UpdateRequest = async (id) => {
// 	const requestOptions = {
// 		method: 'UPDATE',
// 		headers: {'Content-Type': 'application/json'},
// 		body: JSON.stringify(id)
// 	}

// 	const response = await fetch(url, requestOptions);
// 	const data = response.json();
// 	return data
// }
'use strict';

const databaseManager = require('./databaseManager');
const uuidv1 = require('uuid/v1');

exports.servicesOrders = (event, context, callback) => {
	console.log(event);

	switch (event.httpMethod) {
		case 'DELETE':
			deleteItem(event, callback);
			break;
		case 'GET':
			getItem(event, callback);
			break;
		case 'POST':
			saveItem(event, callback);
			break;
		case 'PUT':
			updateItem(event, callback);
			break;
		default:
			sendResponse(404, `Unsupported method "${event.httpMethod}"`, callback);
	}
};

function saveItem(event, callback) {

	const timestamp = new Date().getTime();
	const item = JSON.parse(event.body);
	item.itemId = uuidv1();
	item.createdAt= timestamp;
	item.updatedAt= timestamp;


	databaseManager.saveItem(item).then(response => {
		console.log(response);
		sendResponse(200, item.itemId, callback);
	});
}

function getItem(event, callback) {

	if(event.pathParameters){
		const itemId = event.pathParameters.itemId;
		console.log(itemId);
		databaseManager.getItem(itemId).then(response => {
			console.log(response);
			sendResponse(200, JSON.stringify(response), callback);
		});
	}
	else{
		databaseManager.getAllItems().then(response => {
			console.log( "ALL" + response);
			sendResponse(200, JSON.stringify(response), callback);
		});
	}
}

function deleteItem(event, callback) {
	const itemId = event.pathParameters.itemId;

	databaseManager.deleteItem(itemId).then(response => {
		sendResponse(200, 'DELETE ITEM', callback);
	});
}

function updateItem(event, callback) {
	const timestamp = new Date().getTime();
	const itemId = event.pathParameters.itemId;
	const body = JSON.parse(event.body);
	const serviceOrder = {
		orderNumber : body.orderNumber,
		orderDate: body.orderDate,
		endDate: body.endDate,
		createdAt: body.createdAt,
		updatedAt: timestamp
	};

	databaseManager.updateItem(itemId, serviceOrder).then(response => {
		console.log(response);
		sendResponse(200, 'SO Updated', callback);
	});
}

function sendResponse(statusCode, message, callback) {
	const response = {
		statusCode: statusCode,
		headers: { "Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Credentials" : true,
			"Content-Type": "application/json"},
		body: JSON.stringify(message)
	};
	callback(null, response);
}

const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const eventsTableName = 'Events'; // Replace with your actual DynamoDB Events table name
const ordersTableName = 'Orders'; // Replace with your actual DynamoDB Orders table name

exports.handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    let body;
    try {
        body = JSON.parse(event.body);
    } catch (error) {
        console.error('Error parsing event body:', error);
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': false
            },
            body: JSON.stringify({ error: 'Invalid request body' })
        };
    }

    const { id } = body;

    const deleteEventParams = {
        TableName: eventsTableName,
        Key: { id: id }
    };

    try {
        // Delete the event from the Events table
        await dynamoDB.delete(deleteEventParams).promise();
        console.log('Event deleted successfully');

        // Update the corresponding orders in the Orders table
        const scanOrdersParams = {
            TableName: ordersTableName,
            FilterExpression: "id = :id",
            ExpressionAttributeValues: { ":id": id }
        };

        const orders = await dynamoDB.scan(scanOrdersParams).promise();
        const updateOrderPromises = orders.Items.map(order => {
            const updateOrderParams = {
                TableName: ordersTableName,
                Key: { email: order.email, id: order.id },
                UpdateExpression: "SET deleted = :deleted",
                ExpressionAttributeValues: {
                    ":deleted": true
                },
                ReturnValues: "ALL_NEW"
            };
            return dynamoDB.update(updateOrderParams).promise();
        });

        await Promise.all(updateOrderPromises);
        console.log('Orders updated successfully');

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': false
            },
            body: JSON.stringify({ message: 'Event deleted and orders updated successfully' })
        };
    } catch (error) {
        console.error('Error deleting event and updating orders:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': false
            },
            body: JSON.stringify({ error: 'Could not delete event and update orders' })
        };
    }
};

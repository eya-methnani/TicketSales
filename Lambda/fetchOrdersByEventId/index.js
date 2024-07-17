const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const ordersTableName = 'Orders'; // Replace with your actual DynamoDB Orders table name

exports.handler = async (event) => {
    try {
        const eventId = event.queryStringParameters.eventId;

        // Scan the table and filter by eventId
        const params = {
            TableName: ordersTableName,
            FilterExpression: '#id = :eventId',
            ExpressionAttributeNames: {
                '#id': 'id'
            },
            ExpressionAttributeValues: {
                ':eventId': eventId
            }
        };

        const data = await dynamoDB.scan(params).promise();

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ Items: data.Items }),
        };
    } catch (error) {
        console.error('Error fetching orders:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ error: 'Could not fetch orders' }),
        };
    }
};

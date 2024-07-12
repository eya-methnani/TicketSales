const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = 'Events'; // Replace with your actual DynamoDB table name

exports.handler = async (event) => {
    try {
        const cart = JSON.parse(event.body);
        
        for (let item of cart) {
            const params = {
                TableName: tableName,
                Key: { id: item.id },
                UpdateExpression: 'set #cap = #cap - :quantity',
                ExpressionAttributeNames: {
                    '#cap': 'capacity'
                },
                ExpressionAttributeValues: {
                    ':quantity': item.quantity
                },
                ReturnValues: 'UPDATED_NEW'
            };
            await dynamoDB.update(params).promise();
        }
        
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ message: 'Event capacities updated successfully' }),
        };
    } catch (error) {
        console.error('Error updating event capacities:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ error: 'Could not update event capacities' }),
        };
    }
};

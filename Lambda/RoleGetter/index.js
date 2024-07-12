const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = 'Users'; // Replace with your actual DynamoDB table name

exports.handler = async (event) => {
    try {
        const email = event.pathParameters.email; // Extracting the id from the path parameters

        const params = {
            TableName: tableName,
            Key: {
                email: email
            }
        };

        const data = await dynamoDB.get(params).promise();

        if (!data.Item) {
            return {
                statusCode: 404,
                headers: {
                    'Access-Control-Allow-Origin': '*', // Allow from all origins
                    'Access-Control-Allow-Credentials': false,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ error: 'Item not found' })
            };
        }

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // Allow from all origins
                'Access-Control-Allow-Credentials': false,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ role: data.Item.role })
        };
    } catch (error) {
        console.error('Error getting item:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*', // Allow from all origins
                'Access-Control-Allow-Credentials': false,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'Could not get item' })
        };
    }
};

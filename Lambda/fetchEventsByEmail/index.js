const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const eventsTableName = 'Events'; // Replace with your actual DynamoDB Events table name

exports.handler = async (event) => {
    try {
        const email = event.queryStringParameters.email;

        const params = {
            TableName: eventsTableName,
            IndexName: 'email-index', // Ensure you have a secondary index on the email attribute
            KeyConditionExpression: '#email = :email',
            ExpressionAttributeNames: {
                '#email': 'email'
            },
            ExpressionAttributeValues: {
                ':email': email
            }
        };

        const data = await dynamoDB.query(params).promise();

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ Items: data.Items }),
        };
    } catch (error) {
        console.error('Error fetching events:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ error: 'Could not fetch events' }),
        };
    }
};

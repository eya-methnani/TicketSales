

/*
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME;

exports.handler = async (event) => {
  let requestBody;
  
  try {
    requestBody = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid JSON format' })
    };
  }

  const { email, role } = requestBody;

  if (!email || !role) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing email or role' })
    };
  }

  const params = {
    TableName: tableName,
    Item: {
      email,
      role
    }
  };

  try {
    await dynamo.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User role saved successfully' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error saving user role', error })
    };
  }
};
*/




const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const tableName = 'Users'; // Replace with your actual DynamoDB table name

exports.handler = async (event) => {
    try {
        const item = JSON.parse(event.body); // Parsing the JSON input
        const params = {
            TableName: tableName,
            Item: item
        };

        await dynamodb.put(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Item created', item: item })
        };
    } catch (error) {
        console.error('Error creating item:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not create item' })
        };
    }
};

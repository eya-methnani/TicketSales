const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const email = event.queryStringParameters.email;

  const params = {
    TableName: 'Users',
    Key: {
      email: email,
    },
  };

  try {
    const data = await dynamoDB.get(params).promise();
    if (data.Item) {
      return {
        statusCode: 200,
        body: JSON.stringify({ role: data.Item.role }),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not retrieve user role' }),
    };
  }
};

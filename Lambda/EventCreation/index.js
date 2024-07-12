const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = 'Events'; // Replace with your actual DynamoDB table name

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

  const { name, description, photo, date, price, capacity, email } = body;

  const params = {
    TableName: tableName,
    Item: {
      id: AWS.util.uuid.v4(), // Generate a unique ID for the event
      name: name,
      description: description,
      photo: photo,
      date: date,
      price: price,
      capacity: capacity,
      email: email,
      createdAt: new Date().toISOString()
    }
  };

  try {
    await dynamoDB.put(params).promise();
    console.log('Event created successfully:', params.Item);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': false
      },
      body: JSON.stringify({ message: 'Event created successfully' })
    };
  } catch (error) {
    console.error('Error creating event:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': false
      },
      body: JSON.stringify({ error: 'Could not create event' })
    };
  }
};

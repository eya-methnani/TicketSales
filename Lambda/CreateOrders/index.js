const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const ordersTableName = 'Orders'; // Replace with your actual DynamoDB Orders table name

exports.handler = async (event) => {
    try {
        const requestBody = JSON.parse(event.body);
        const { email, cart } = requestBody;

        // Create an order item for each event in the cart
        const orderItems = cart.map(item => ({
            PutRequest: {
                Item: {
                    email: email,
                    id: item.id,
                    eventName: item.name,
                    eventDate: item.date,
                    price: item.price,
                    quantity: item.quantity,
                    photo: item.photo,
                    description: item.description,
                    contact: item.email
                }
            }
        }));

        // Batch write to DynamoDB
        const params = {
            RequestItems: {
                [ordersTableName]: orderItems
            }
        };

        await dynamoDB.batchWrite(params).promise();

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ message: 'Orders created successfully' }),
        };
    } catch (error) {
        console.error('Error creating orders:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ error: 'Could not create orders' }),
        };
    }
};

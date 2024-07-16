const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const ordersTableName = 'Orders'; // Replace with your actual DynamoDB Orders table name

exports.handler = async (event) => {
    try {
        const requestBody = JSON.parse(event.body);
        const { email, cart } = requestBody;

        for (const item of cart) {
            const params = {
                TableName: ordersTableName,
                Key: {
                    id: item.id
                }
            };

            const result = await dynamoDB.get(params).promise();

            if (result.Item && result.Item.email === email) {
                // Order already exists for the same user, update the quantity
                const updateParams = {
                    TableName: ordersTableName,
                    Key: {
                        id: item.id
                    },
                    UpdateExpression: 'set quantity = quantity + :quantity',
                    ExpressionAttributeValues: {
                        ':quantity': item.quantity
                    },
                    ReturnValues: 'UPDATED_NEW'
                };
                await dynamoDB.update(updateParams).promise();
            } else {
                // Order does not exist or exists for a different user, create a new order
                const newItem = {
                    email: email,
                    id: item.id,
                    eventName: item.name,
                    eventDate: item.date,
                    price: item.price,
                    quantity: item.quantity,
                    photo: item.photo,
                    description: item.description,
                    contact: item.email
                };

                const putParams = {
                    TableName: ordersTableName,
                    Item: newItem
                };

                await dynamoDB.put(putParams).promise();
            }
        }

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

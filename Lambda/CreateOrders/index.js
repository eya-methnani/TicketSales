const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const ordersTableName = 'Orders'; // Replace with your actual DynamoDB Orders table name

exports.handler = async (event) => {
    try {
        const requestBody = JSON.parse(event.body);
        const { email, cart } = requestBody;

        // Iterate through the cart items to create or update orders
        for (const item of cart) {
            const params = {
                TableName: ordersTableName,
                Key: {
                    email: email,
                    id: item.id
                },
                UpdateExpression: "SET eventName = :eventName, eventDate = :eventDate, price = :price, quantity = if_not_exists(quantity, :initial) + :quantity, photo = :photo, description = :description, contact = :contact",
                ExpressionAttributeValues: {
                    ":eventName": item.name,
                    ":eventDate": item.date,
                    ":price": item.price,
                    ":initial": 0,
                    ":quantity": item.quantity,
                    ":photo": item.photo,
                    ":description": item.description,
                    ":contact": item.email
                },
                ReturnValues: "ALL_NEW"
            };

            await dynamoDB.update(params).promise();
        }

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ message: 'Orders created/updated successfully' }),
        };
    } catch (error) {
        console.error('Error creating/updating orders:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ error: 'Could not create/update orders' }),
        };
    }
};

const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const eventsTableName = 'Events'; // Replace with your actual DynamoDB Events table name
const ordersTableName = 'Orders'; // Replace with your actual DynamoDB Orders table name

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

    const { id, name, description, photo, date, price, capacity, email } = body;

    const updateEventParams = {
        TableName: eventsTableName,
        Key: { id: id },
        UpdateExpression: "SET #name = :name, description = :description, photo = :photo, #date = :date, price = :price, #capacity = :capacity, email = :email",
        ExpressionAttributeNames: {
            "#name": "name",
            "#date": "date",
            "#capacity": "capacity"
        },
        ExpressionAttributeValues: {
            ":name": name,
            ":description": description,
            ":photo": photo,
            ":date": date,
            ":price": price,
            ":capacity": capacity,
            ":email": email
        },
        ReturnValues: "ALL_NEW"
    };

    try {
        // Update the event in the Events table
        const updateEventResult = await dynamoDB.update(updateEventParams).promise();
        console.log('Event updated successfully:', updateEventResult.Attributes);

        // Update the corresponding orders in the Orders table
        const scanOrdersParams = {
            TableName: ordersTableName,
            FilterExpression: "id = :id",
            ExpressionAttributeValues: { ":id": id }
        };

        const orders = await dynamoDB.scan(scanOrdersParams).promise();
        const updateOrderPromises = orders.Items.map(order => {
            const updateOrderParams = {
                TableName: ordersTableName,
                Key: { email: order.email, id: order.id },
                UpdateExpression: "SET eventName = :eventName, eventDate = :eventDate, price = :price, photo = :photo, description = :description, contact = :contact",
                ExpressionAttributeValues: {
                    ":eventName": name,
                    ":eventDate": date,
                    ":price": price,
                    ":photo": photo,
                    ":description": description,
                    ":contact": email
                },
                ReturnValues: "ALL_NEW"
            };
            return dynamoDB.update(updateOrderParams).promise();
        });

        await Promise.all(updateOrderPromises);
        console.log('Orders updated successfully');

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': false
            },
            body: JSON.stringify({ message: 'Event and orders updated successfully' })
        };
    } catch (error) {
        console.error('Error updating event and orders:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': false
            },
            body: JSON.stringify({ error: 'Could not update event and orders' })
        };
    }
};

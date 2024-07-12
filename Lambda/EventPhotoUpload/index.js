const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const bucketName = 'event-photo-upload-bucket'; // Replace with your S3 bucket name

exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  const body = JSON.parse(event.body);
  const fileContent = Buffer.from(body.fileContent, 'base64');
  const fileName = `${Date.now()}-${body.fileName}`;
  
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileContent,
    ContentType: body.contentType
  };

  try {
    const data = await s3.upload(params).promise();
    console.log('File uploaded successfully:', data.Location);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Allow from all origins
        'Access-Control-Allow-Credentials': false
      },
      body: JSON.stringify({ photoUrl: data.Location })
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*', // Allow from all origins
        'Access-Control-Allow-Credentials': false
      },
      body: JSON.stringify({ error: 'Could not upload file' })
    };
  }
};

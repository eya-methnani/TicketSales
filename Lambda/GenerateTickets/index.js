const AWS = require('aws-sdk');
const PDFDocument = require('pdfkit');
const s3 = new AWS.S3();

const myLogic = (input) => {
    const { orderId, eventName, eventDate, price, quantity, contact } = input;
    return new Promise((resolve, reject) => {
        // Create a new PDF document
        const doc = new PDFDocument();
        let buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', async () => {
            try {
                const pdfData = Buffer.concat(buffers);
                const params = {
                    Bucket: 'generate-tickets', // Replace with your S3 bucket name
                    Key: `${orderId}.pdf`,
                    Body: pdfData,
                    ContentType: 'application/pdf'
                };
                await s3.upload(params).promise();
                console.log(`PDF uploaded successfully at ${params.Key}`);
                resolve(params.Key);
            } catch (error) {
                console.error('Error uploading PDF:', error);
                reject(error);
            }
        });

        // Add content to the PDF
        doc.fontSize(25).text('Ticket', { align: 'center' });
        doc.moveDown();
        doc.fontSize(20).text(`Event: ${eventName}`);
        doc.fontSize(15).text(`Date: ${eventDate}`);
        doc.fontSize(15).text(`Price: $${price}`);
        doc.fontSize(15).text(`Quantity: ${quantity}`);
        doc.fontSize(15).text(`Contact: ${contact}`);
        doc.end();
    });
};

exports.handler = async (event) => {
    const { orderId, eventName, eventDate, price, quantity, contact } = JSON.parse(event.body);
    try {
        const pdfKey = await myLogic({
            orderId,
            eventName,
            eventDate,
            price,
            quantity,
            contact,
        });

        const url = s3.getSignedUrl('getObject', {
            Bucket: 'generate-tickets',
            Key: pdfKey,
            Expires: 60 * 5 // URL expiry time in seconds (5 minutes)
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'PDF generated successfully', key: pdfKey, url })
        };
    } catch (error) {
        console.error('Error generating PDF:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error generating PDF' })
        };
    }
};

const AWS = require('aws-sdk');
const PDFDocument = require('pdfkit');
const s3 = new AWS.S3();

exports.handler = async (event) => {
    const { orderId, eventName, eventDate, price, quantity, contact } = JSON.parse(event.body);

    // Create a new PDF document
    const doc = new PDFDocument();
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
        const pdfData = Buffer.concat(buffers);

        const params = {
            Bucket: 'generate-tickets', // Replace with your S3 bucket name
            Key: `${orderId}.pdf`,
            Body: pdfData,
            ContentType: 'application/pdf'
        };

        try {
            await s3.upload(params).promise();

            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'PDF generated successfully', key: `${orderId}.pdf` })
            };
        } catch (error) {
            console.error('Error uploading PDF:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Error uploading PDF' })
            };
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
};

const AWS = require('aws-sdk');
const axios = require('axios');
const pdfmake = require('pdfmake');
const s3 = new AWS.S3();

const fonts = {
    Roboto: {
        normal: Buffer.from(require('pdfmake/build/vfs_fonts.js').pdfMake.vfs['Roboto-Regular.ttf'], 'base64'),
        bold: Buffer.from(require('pdfmake/build/vfs_fonts.js').pdfMake.vfs['Roboto-Medium.ttf'], 'base64'),
        italics: Buffer.from(require('pdfmake/build/vfs_fonts.js').pdfMake.vfs['Roboto-Italic.ttf'], 'base64'),
        bolditalics: Buffer.from(require('pdfmake/build/vfs_fonts.js').pdfMake.vfs['Roboto-MediumItalic.ttf'], 'base64')
    }
};

const myLogic = async (input) => {
    const { orderId, eventName, eventDate, price, quantity, contact } = input;
    const logoUrl = 'https://www.sportstrategies.com/wp-content/uploads/2021/08/logo-tiketchainer-typo-bleu-horizontale.png';

    // Fetch the logo image
    const response = await axios.get(logoUrl, { responseType: 'arraybuffer' });
    const logoBase64 = Buffer.from(response.data, 'binary').toString('base64');

    return new Promise((resolve, reject) => {
        const printer = new pdfmake(fonts);
        const docDefinition = {
            content: [
                {
                    image: `data:image/png;base64,${logoBase64}`,
                    width: 300,
                    alignment: 'right',
                    margin: [0, 0, 0, 20]
                },
                { text: 'Ticket', style: 'header' },
                { text: `Event: ${eventName}`, style: 'subheader' },
                { text: `Date: ${eventDate}`, style: 'subheader' },
                { text: `Price: $${price}`, style: 'subheader' },
                { text: `Quantity: ${quantity}`, style: 'subheader' },
                { text: `Contact: ${contact}`, style: 'subheader' }
            ],
            styles: {
                header: {
                    fontSize: 22,
                    bold: true,
                    margin: [0, 20, 0, 10]
                },
                subheader: {
                    fontSize: 16,
                    margin: [0, 10, 0, 5]
                }
            }
        };

        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        let chunks = [];
        pdfDoc.on('data', (chunk) => {
            chunks.push(chunk);
        });
        pdfDoc.on('end', async () => {
            try {
                const pdfData = Buffer.concat(chunks);
                const params = {
                    Bucket: 'generate-tickets',
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
        pdfDoc.end();
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

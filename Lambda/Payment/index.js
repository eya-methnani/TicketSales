const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const amount = body.amount;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ client_secret: paymentIntent.client_secret }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

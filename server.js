const express = require('express')
const querystring = require('querystring')
const https = require('https')
const bodyParser = require('body-parser');
const crypto = require('crypto');
const app = express()



// Enable CORS to allow cross-origin requests from WooCommerce
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  next();
});

// Parse incoming webhook data as JSON
app.use(bodyParser.json());

// Handle incoming WooCommerce webhook requests
app.post('/woocommerce-webhook', (req, res) => {
  // Get the webhook data from the request body
  const webhookData = req.body;

  // Process the webhook data as needed
  console.log('Received WooCommerce webhook:', webhookData);

  // Send a response to WooCommerce to confirm receipt of the webhook data
  res.status(200).send('Webhook received');

  const orderData = {
    externalId: webhookData.line_items[0].variation_id,
    firstName: webhookData.billing.first_name,
    lastName: webhookData.billing.last_name,
    email: webhookData.billing.email,
    phone: webhookData.billing.phone,
    paymentType: webhookData.payment_method,
    paymentStatus: webhookData.payment_method_title,
    deliveryType: webhookData.shipping_method,
    deliveryAddress: webhookData.shipping.address_1,
    deliveryCity: webhookData.shipping.city,
    deliveryRegion: webhookData.shipping.state,
    deliveryCountry: webhookData.shipping.country,
    items: webhookData.line_items.map(item => ({
      externalIds: { WooCommerce: item.variation_id },
      offer: { externalId: item.variation_id },
      quantity: item.quantity,
      purchasePrice: item.price,
    })),
  };
  const postData = querystring.stringify({ order: orderData });

  // Set the request options
  const options = {
    hostname: 'https://malik-brand.retailcrm.ru/',
    path: '/api/v5/orders/create',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData),
      'X-API-KEY': 'hZTuUun440aC7NSGLUeFaAyjCX0hh8Wp'
    },
  };
  // Send the order data to RetailCRM's API to create the order
  const reqq = https.request(options, (res) => {
    console.log(`RetailCRM API response status: ${res.statusCode}`);

    res.on('data', (d) => {
      process.stdout.write(d);
    });
  });

  reqq.on('error', (error) => {
    console.error('Error creating order in RetailCRM:', error);
    res.status(500).send('Error creating order in RetailCRM');
  });

  reqq.write(postData);
  reqq.end();

  console.log('Order data sent to RetailCRM:', orderData);

});
// Handle incoming WooCommerce webhook requests

// Start the Express.js server
app.listen(process.env.PORT || 5000, () => {
  console.log(`Example app listening on port`)
})
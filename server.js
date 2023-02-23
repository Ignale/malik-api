const express = require('express')
const querystring = require('querystring')
const request = require('request')
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
    site: 'malik-brand.com',
    order: JSON.stringify({
      externalId: webhookData.line_items[0].variation_id,
      firstName: webhookData.billing.first_name,
      lastName: webhookData.billing.last_name,
      email: webhookData.billing.email,
      phone: webhookData.billing.phone,
      status: 'availability-confirmed',
      paymentType: webhookData.payment_method,
      paymentStatus: webhookData.payment_method_title,
      deliveryType: webhookData.shipping_method,
      deliveryAddress: webhookData.shipping.address_1,
      deliveryCity: webhookData.shipping.city,
      deliveryRegion: webhookData.shipping.state,
      deliveryCountry: webhookData.shipping.country,
      items: webhookData.line_items.map(item => ({
        productName: item.name,
        externalIds: [{ code: 'woocommerce' }, { value: item.variation_id }],
        offer: { externalId: item.variation_id },
        quantity: item.quantity,
        purchasePrice: item.price,
        comment: webhookData.shipping.address_1,
        properties: [
          { name: item.name },
          {}
        ]
      })),
    })

  };
  const postData = querystring.stringify(orderData);

  // Set the request options
  const options = {
    url: 'https://malik-brand.retailcrm.ru/api/v5/orders/create?apiKey=hZTuUun440aC7NSGLUeFaAyjCX0hh8Wp',
    method: 'POST',
    body: postData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
  // Send the order data to RetailCRM's API to create the order
  request(options, (error, response, body) => {
    if (error) {
      console.error('Error sending data to RetailCRM:', error);
      res.status(500).send('Error sending data to RetailCRM');
    } else {
      console.log('Data sent to RetailCRM:', body);
      res.status(200).send('Webhook received');
    }
  })

  console.log('Order data sent to RetailCRM:', orderData);

});
// Handle incoming WooCommerce webhook requests

// Start the Express.js server
app.listen(process.env.PORT || 5000, () => {
  console.log(`Example app listening on port`)
})
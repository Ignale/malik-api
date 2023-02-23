const express = require('express');
const bodyParser = require('body-parser');

const app = express();

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
});

// Start the Express.js server
const port = 3000;
app.listen(port, () => {
  console.log(`Express.js server listening on port ${port}`);
});
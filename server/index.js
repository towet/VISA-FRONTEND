const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const config = {
  consumerKey: '94lXZNXKZK5RG43dF0qeb4wcPkzmutYG',
  consumerSecret: 'XWnqyb3y0rNi08lT7MgSLL3j1mU=',
  apiDomain: 'https://pay.pesapal.com/v3',
  callbackUrl: 'http://localhost:3000/payment-status',
  ipnUrl: 'https://6f99-102-214-72-0.ngrok-free.app/api/pesapal/ipn'
};

console.log('Server config:', {
  consumerKey: config.consumerKey,
  apiDomain: config.apiDomain,
  ipnUrl: config.ipnUrl
});

let authToken = null;
let tokenExpiry = null;

async function getAuthToken() {
  if (authToken && tokenExpiry && new Date() < tokenExpiry) {
    return authToken;
  }

  try {
    console.log('Getting auth token...');
    const response = await fetch(`${config.apiDomain}/api/Auth/RequestToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        consumer_key: config.consumerKey,
        consumer_secret: config.consumerSecret,
      }),
    });

    const responseText = await response.text();
    console.log('Auth response text:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse auth response:', e);
      throw new Error('Invalid response from Pesapal auth');
    }

    if (!response.ok) {
      throw new Error(data.error || 'Failed to get auth token');
    }

    if (!data.token) {
      console.error('No token in response:', data);
      throw new Error('No token in auth response');
    }

    authToken = data.token;
    tokenExpiry = new Date(Date.now() + (data.expiryDate || 3600) * 1000);
    return authToken;
  } catch (error) {
    console.error('Error getting auth token:', error);
    throw error;
  }
}

// Register IPN URL
async function registerIpnUrl() {
  try {
    const token = await getAuthToken();
    console.log('Registering IPN URL:', config.ipnUrl);

    const response = await fetch(`${config.apiDomain}/api/URLSetup/RegisterIPN`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        url: config.ipnUrl,
        ipn_notification_type: 'GET',
      }),
    });

    const responseText = await response.text();
    console.log('IPN registration response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse IPN registration response:', e);
      throw new Error('Invalid response from Pesapal IPN registration');
    }

    if (!response.ok) {
      throw new Error(data.error || 'Failed to register IPN URL');
    }

    return data.ipn_id;
  } catch (error) {
    console.error('Error registering IPN URL:', error);
    throw error;
  }
}

// List registered IPN URLs
async function listRegisteredIpns() {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${config.apiDomain}/api/URLSetup/GetIpnList`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    console.log('Registered IPNs:', data);
    return data;
  } catch (error) {
    console.error('Error listing IPNs:', error);
    throw error;
  }
}

app.get('/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.post('/api/pesapal/order', async (req, res) => {
  try {
    const token = await getAuthToken();
    console.log('Creating order with data:', req.body);

    // First get list of IPNs
    console.log('Getting list of IPNs...');
    const ipnListResponse = await fetch(`${config.apiDomain}/api/URLSetup/GetIpnList`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });

    const ipnList = await ipnListResponse.json();
    console.log('IPN List:', ipnList);

    let ipnId;
    // Check if our URL is already registered
    const existingIpn = ipnList.find(ipn => ipn.url === config.ipnUrl);
    
    if (existingIpn) {
      console.log('Found existing IPN:', existingIpn);
      ipnId = existingIpn.ipn_id;
    } else {
      // Register new IPN
      console.log('Registering new IPN...');
      const ipnResponse = await fetch(`${config.apiDomain}/api/URLSetup/RegisterIPN`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          url: config.ipnUrl,
          ipn_notification_type: 'GET'
        }),
      });

      const ipnData = await ipnResponse.json();
      console.log('IPN registration response:', ipnData);

      if (!ipnData.ipn_id) {
        throw new Error('Failed to get IPN ID');
      }
      ipnId = ipnData.ipn_id;
    }

    console.log('Using IPN ID:', ipnId);

    const orderData = {
      id: req.body.id,
      currency: 'KES',
      amount: req.body.amount,
      description: req.body.description,
      callback_url: config.callbackUrl,
      notification_id: ipnId,
      billing_address: req.body.billing_address
    };

    console.log('Sending order request to Pesapal:', orderData);

    const response = await fetch(`${config.apiDomain}/api/Transactions/SubmitOrder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    const responseText = await response.text();
    console.log('Raw order response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse order response:', e);
      throw new Error('Invalid response from Pesapal');
    }

    console.log('Parsed order response:', data);

    if (!response.ok || data.error) {
      const errorMessage = data.error?.message || data.error || 'Failed to create order';
      console.error('Order error:', data.error);
      return res.status(response.status || 500).json({ error: errorMessage });
    }

    res.json(data);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      error: error.message || 'Internal server error',
    });
  }
});

// IPN handler endpoint
app.get('/api/pesapal/ipn', async (req, res) => {
  try {
    console.log('Received IPN notification:', req.query);
    const { OrderTrackingId, OrderMerchantReference, Status } = req.query;

    // Verify the transaction status
    const token = await getAuthToken();
    const response = await fetch(`${config.apiDomain}/api/Transactions/GetTransactionStatus?orderTrackingId=${OrderTrackingId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log('Transaction status:', data);

    // TODO: Update your database with payment status

    res.status(200).send('OK');
  } catch (error) {
    console.error('Error handling IPN:', error);
    res.status(500).send('Error');
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test URL: http://localhost:${PORT}/test`);
  console.log(`IPN URL: ${config.ipnUrl}`);
  console.log(`Order URL: http://localhost:${PORT}/api/pesapal/order`);
});

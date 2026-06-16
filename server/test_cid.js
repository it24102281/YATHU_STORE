const dotenv = require('dotenv');
dotenv.config();

const { getResellerOrderStatus } = require('./services/resellerClient');

async function testCid() {
  try {
    console.log('Fetching status for order 1340552...');
    const status = await getResellerOrderStatus('1340552');
    console.log('API Response:', JSON.stringify(status, null, 2));
  } catch (error) {
    console.error('Error fetching order status:', error.message);
    if (error.raw) {
      console.error('Raw response:', error.raw);
    }
  }
}

testCid();

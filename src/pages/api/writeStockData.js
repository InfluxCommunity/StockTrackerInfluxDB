import influxdb from '../../lib/influxdb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { symbol, data } = req.body;

  console.log('Received request to write data for symbol:', symbol);
  console.log('Data points received:', data.length);
  console.log('Sample data point:', JSON.stringify(data[0], null, 2));
  console.log('Date range:', new Date(data[data.length - 1].date), 'to', new Date(data[0].date));

  try {
    await influxdb.writeStockData(symbol, data);
    console.log('Data processing and writing completed');
    res.status(200).json({ message: 'Data written successfully' });
  }
  catch (error) {
    console.error('Error writing to InfluxDB:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      error: 'Failed to write data to InfluxDB',
      details: error.message,
      stack: error.stack
    });
  }
}
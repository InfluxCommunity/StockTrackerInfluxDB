import influxdb from '../../lib/influxdb';

export default async function handler(req, res) {
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'Symbol is required' });
  }

  try {
    const data = await influxdb.queryStockData(symbol);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error querying InfluxDB:', error);
    res.status(500).json({ error: 'Failed to query data from InfluxDB', details: error.message });
  }
}
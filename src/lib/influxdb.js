import { InfluxDBClient } from '@influxdata/influxdb3-client';

const host = process.env.NEXT_PUBLIC_INFLUXDB_URL;
const token = process.env.INFLUXDB_TOKEN;
const database = process.env.INFLUXDB_BUCKET;

console.log('InfluxDB configuration:', { host, database, tokenSet: !!token });

const client = new InfluxDBClient({ host, token, database });

async function writeStockData(symbol, data) {
  console.log(`Processing ${data.length} points for symbol ${symbol}`);
  try {
    const now = Date.now();
    const retentionPeriod = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    const oldestAllowedTimestamp = now - retentionPeriod;

    const filteredData = data.filter(point => new Date(point.date).getTime() >= oldestAllowedTimestamp);
    console.log(`Filtered to ${filteredData.length} points within retention period`);

    for (const point of filteredData) {
      const timestamp = Math.max(new Date(point.date).getTime(), oldestAllowedTimestamp) * 1000000; // Convert to nanoseconds
      const line = `stock_price,symbol=${symbol} price=${parseFloat(point.price)} ${timestamp}`;
      await client.write(line, database);
    }
    console.log('Data written successfully');
  } catch (error) {
    console.error('Error in writeStockData:', error);
    throw error;
  }
}

async function queryStockData(symbol, range = '7d') {
  const query = `
    SELECT *
    FROM "stock_price"
    WHERE time >= now() - interval '${range}'
    AND "symbol" = '${symbol}'
    ORDER BY time DESC
  `;

  console.log('Executing query:', query);

  try {
    const rows = await client.query(query, database);
    console.log(`Query returned ${rows.length} results`);
    return rows;
  } catch (error) {
    console.error('Error in queryStockData:', error);
    throw error;
  }
}

async function closeClient() {
  try {
    await client.close();
    console.log('InfluxDB client closed successfully');
  } catch (error) {
    console.error('Error closing InfluxDB client:', error);
    throw error;
  }
}

export default { writeStockData, queryStockData, closeClient };
import React, { useState, useEffect } from 'react';
import StockChart from '../components/StockChart';
import StockDataTable from '../components/StockDataTable';
import { fetchStockData } from '../lib/alphaVantage';
import { writeApi } from '../lib/influxdb';
import { Point } from '@influxdata/influxdb-client';

function App() {
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const symbol = 'TSCO.LON';
      const data = await fetchStockData(symbol);
      if (data) {
        setStockData(data);
        // Store data in InfluxDB
        data.forEach(point => {
          const influxPoint = new Point('stock_price')
            .tag('symbol', symbol)
            .floatField('price', point.price)
            .timestamp(new Date(point.date));
          writeApi.writePoint(influxPoint);
        });
        await writeApi.flush();
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Stock Trading Data: TSCO.LON</h1>
      <StockChart data={stockData} />
      <StockDataTable data={stockData} />
    </div>
  );
}

export default App;
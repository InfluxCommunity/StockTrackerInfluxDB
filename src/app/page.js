'use client';

import React, { useState, useEffect } from 'react';
import StockChart from '../components/StockChart';
import StockDataTable from '../components/StockDataTable';
import { fetchStockData } from '../lib/alphaVantage';

export default function Home() {
  const [stockData, setStockData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [symbol, setSymbol] = useState('');

  const fetchAndStoreData = async (stockSymbol) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Fetching data from Alpha Vantage API...');
      const data = await fetchStockData(stockSymbol);
      console.log('Data received from API:', data ? data.length : 'No data');

      if (data && data.length > 0) {
        console.log('Storing data in InfluxDB...');
        const response = await fetch('/api/writeStockData', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbol: stockSymbol, data }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to store data in InfluxDB: ${errorText}`);
        }

        const result = await response.json();
        console.log('Data stored successfully:', result);
        await queryInfluxDB(stockSymbol);
      } else {
        setError('No data received from API');
      }
    } catch (err) {
      console.error('Error in fetchAndStoreData:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const queryInfluxDB = async (stockSymbol) => {
    try {
      console.log('Querying InfluxDB for symbol:', stockSymbol);
      const response = await fetch(`/api/stockData?symbol=${stockSymbol}`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch data from InfluxDB: ${errorText}`);
      }
      const data = await response.json();
      console.log('Data retrieved from InfluxDB:', data.length);
      if (data && data.length > 0) {
        setStockData(data);
      } else {
        console.log('No data retrieved from InfluxDB');
        setStockData([]);
      }
    } catch (err) {
      console.error('Error querying InfluxDB:', err);
      setError(`Error querying data: ${err.message}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (symbol) {
      fetchAndStoreData(symbol);
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Stock Trading Data</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="Enter stock symbol"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Fetch Data'}
        </button>
      </form>
      {error && <div className="text-red-500 mb-4">Error: {error}</div>}
      {stockData.length > 0 ? (
        <>
          <StockChart data={stockData} />
          <StockDataTable data={stockData} />
        </>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}
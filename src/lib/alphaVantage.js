const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

export async function fetchStockData(symbol) {
  console.log('fetchStockData called with symbol:', symbol);
  console.log('API_KEY:', API_KEY);

  if (!API_KEY) {
    console.error('Alpha Vantage API key is not set');
    throw new Error('API key is not configured');
  }

  const url = `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${API_KEY}`;

  console.log('Fetching stock data from URL:', url);

  try {
    const response = await fetch(url);
    console.log('Response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    console.log('API Response:', JSON.stringify(data, null, 2));

    if (data['Time Series (Daily)']) {
      const timeSeriesData = data['Time Series (Daily)'];
      const formattedData = Object.entries(timeSeriesData).map(([date, values]) => ({
        date,
        price: parseFloat(values['4. close'])
      }));
      console.log(`Formatted ${formattedData.length} data points`);
      return formattedData;
    } else if (data['Error Message']) {
      throw new Error(data['Error Message']);
    } else if (data['Note']) {
      throw new Error(data['Note']);
    } else {
      console.error('Unexpected API response structure:', data);
      throw new Error('Unexpected response structure from Alpha Vantage API');
    }
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol}:`, error);
    throw error;
  }
}
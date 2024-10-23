# Stock Tracker Web App
Demo web app to track stock data, store and do real time analytics using InfluxDB.

### Key Technologies

- Next.js: Backend
- PM2 : Performance monitoring
- React: Front end including for data visualization
- InfluxDB Cloud & Node.JS SDK: To store and query stock data. Cloud credentials are used and entered in .env.local file in order to communicate with InfluxDB.
- AlphaVantage API: 3rd party API that provides stock related information. You will need an API key for this and enter it in .env.local file.

### Setup and Run

1. Clone/Download this repository and `cd` into it.
2. Open .env file and update it with your account information.
3. Run the following commands.

```
npm install
npm run dev
```

Open localhost:3000 and enter any STOCK symbol to see the historical values in the graph.

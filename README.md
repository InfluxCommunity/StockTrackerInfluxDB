# Stock Tracker Web App
Demo web app to track stock data, store and do real time analytics using InfluxDB.

### Key Technologies

- Next.js: Backend
- React: Front end
- InfluxDB Cloud: To store and query stock data. Cloud credentials are used and entered in .env.local file in order to communicate with InfluxDB.
- AlphaVantage : 3rd party API that provides stock related information. You will need an API key for this and enter it in .env.local file.

### Setup and Run

```
npm install
npm run dev
```

Open localhost:3000 and enter any STOCK symbol to see the historical values in the graph.

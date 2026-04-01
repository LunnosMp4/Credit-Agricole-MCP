# Credit Agricole MCP

This project is a small MCP server that fetches Credit Agricole account activity using the [js-creditagricole-particuliers](https://www.npmjs.com/package/js-creditagricole-particuliers) library.

It connects to a Credit Agricole account, fetches transactions for the last 24 hours, 7 days, or 30 days, and returns formatted results with simple aggregates.

## What it does

- Authenticates with Credit Agricole using your account credentials.
- Fetches transactions with `js-creditagricole-particuliers`.
- Exposes MCP tools for daily, weekly, and monthly transaction data.
- Returns processed output with transaction totals and basic summaries.

## Requirements

- Node.js 18 or newer
- A Credit Agricole account
- Your account number, password, and region number

## Setup

1. Install dependencies:

	```bash
	npm install
	```

2. Create a `.env` file in the project root with the required values:

	```env
	ACCOUNT_NUMBER=your_account_number
	PASSWORD=your_password
	REGION=your_region_number
	```

3. Start the server:

	```bash
	npm start
	```

## Run modes

The server supports two modes:

- `streamable-http` is the default mode.
- `stdio` runs the server over standard input/output for MCP clients that expect it.

### Start in HTTP mode

```bash
npm run start
```

### Start in stdio mode

```bash
npm run start:stdio
```

## Environment variables

- `ACCOUNT_NUMBER`: Credit Agricole account number
- `PASSWORD`: Credit Agricole password
- `REGION`: Department or region number used by the library
- `PORT`: HTTP port, defaults to `3001`
- `BASE_PATH`: Optional base path for the HTTP server
- `MCP_TOOL_TIMEOUT_MS`: Tool timeout in milliseconds, defaults to `300000`
- `MCP_MAX_RESPONSE_BYTES`: Optional response size limit for tool output
- `MCP_API_KEY`: Optional API key for HTTP requests

If `MCP_API_KEY` is set, requests must include it in one of these ways:

- `x-api-key` header
- `Authorization: Bearer <key>` header
- `?key=<key>` query parameter

## Available tools

- `get_daily_transactions`: transactions from the last 24 hours
- `get_weekly_transactions`: transactions from the last 7 days
- `get_monthly_transactions`: transactions from the last 30 days

Each tool returns:

- the time period
- the date range used
- the formatted transactions
- aggregate values such as debit total, credit total, net balance, and transaction count

## Notes

- The project currently focuses on transaction retrieval and formatting.
- Authentication happens through the `js-creditagricole-particuliers` library, so the exact login flow depends on that package.

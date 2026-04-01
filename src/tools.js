const { authenticate } = require('./auth.js');
const { fetchDailyData, fetchWeeklyData, fetchMonthlyData } = require('./data-fetcher.js');
const { processData } = require('./aggregator.js');

function getRequiredCredentials() {
  const accountNumber = (process.env.ACCOUNT_NUMBER || '').trim();
  const password = (process.env.PASSWORD || '').trim();
  const region = (process.env.REGION || '').trim();

  const missing = [];
  if (!accountNumber) missing.push('ACCOUNT_NUMBER');
  if (!password) missing.push('PASSWORD');
  if (!region) missing.push('REGION');

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return { accountNumber, password, region };
}

async function withAuthenticatedAccount(run) {
  const { accountNumber, password, region } = getRequiredCredentials();
  const { session, account } = await authenticate(accountNumber, password, region);
  return run(session, account);
}

const tools = [
  {
    name: 'get_daily_transactions',
    description: 'Get account transactions from the last 24 hours with debit/credit aggregates.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'get_weekly_transactions',
    description: 'Get account transactions from the last 7 days with debit/credit aggregates.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'get_monthly_transactions',
    description: 'Get account transactions from the last 30 days with debit/credit aggregates.',
    inputSchema: { type: 'object', properties: {} },
  },
];

const toolHandlers = {
  get_daily_transactions: async () => {
    return withAuthenticatedAccount(async (session, account) => {
      const data = await fetchDailyData(session, account);
      return processData(data);
    });
  },
  get_weekly_transactions: async () => {
    return withAuthenticatedAccount(async (session, account) => {
      const data = await fetchWeeklyData(session, account);
      return processData(data);
    });
  },
  get_monthly_transactions: async () => {
    return withAuthenticatedAccount(async (session, account) => {
      const data = await fetchMonthlyData(session, account);
      return processData(data);
    });
  },
};

module.exports = { tools, toolHandlers };

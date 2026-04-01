const { getOperations } = require('js-creditagricole-particuliers');
const { format, subDays } = require('date-fns');

/**
 * Fetch transactions for a given date range
 * @param {Object} session - Active Credit Agricole session
 * @param {Object} account - Account object
 * @param {Date} fromDate - Start date
 * @param {Date} toDate - End date
 * @returns {Promise<Array>} Array of transactions
 */
async function fetchTransactions(session, account, fromDate, toDate) {
  const fromDateStr = format(fromDate, 'yyyy-MM-dd');
  const toDateStr = format(toDate, 'yyyy-MM-dd');
  
  try {
    const operations = await getOperations(session, account, fromDateStr, toDateStr);
    return operations || [];
  } catch (error) {
    throw new Error(`Failed to fetch transactions: ${error.message}`);
  }
}

/**
 * Fetch daily transactions (last 24 hours)
 * @param {Object} session - Active Credit Agricole session
 * @param {Object} account - Account object
 * @returns {Promise<{transactions: Array, period: string, dateRange: Object}>}
 */
async function fetchDailyData(session, account) {
  const toDate = new Date();
  const fromDate = subDays(toDate, 1);
  
  const transactions = await fetchTransactions(session, account, fromDate, toDate);
  
  return {
    period: 'daily',
    dateRange: {
      from: format(fromDate, 'yyyy-MM-dd'),
      to: format(toDate, 'yyyy-MM-dd')
    },
    transactions
  };
}

/**
 * Fetch weekly transactions (last 7 days)
 * @param {Object} session - Active Credit Agricole session
 * @param {Object} account - Account object
 * @returns {Promise<{transactions: Array, period: string, dateRange: Object}>}
 */
async function fetchWeeklyData(session, account) {
  const toDate = new Date();
  const fromDate = subDays(toDate, 7);
  
  const transactions = await fetchTransactions(session, account, fromDate, toDate);
  
  return {
    period: 'weekly',
    dateRange: {
      from: format(fromDate, 'yyyy-MM-dd'),
      to: format(toDate, 'yyyy-MM-dd')
    },
    transactions
  };
}

/**
 * Fetch monthly transactions (last 30 days)
 * @param {Object} session - Active Credit Agricole session
 * @param {Object} account - Account object
 * @returns {Promise<{transactions: Array, period: string, dateRange: Object}>}
 */
async function fetchMonthlyData(session, account) {
  const toDate = new Date();
  const fromDate = subDays(toDate, 30);
  
  const transactions = await fetchTransactions(session, account, fromDate, toDate);
  
  return {
    period: 'monthly',
    dateRange: {
      from: format(fromDate, 'yyyy-MM-dd'),
      to: format(toDate, 'yyyy-MM-dd')
    },
    transactions
  };
}

module.exports = {
  fetchTransactions,
  fetchDailyData,
  fetchWeeklyData,
  fetchMonthlyData
};

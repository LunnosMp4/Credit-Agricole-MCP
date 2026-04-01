/**
 * Calculate aggregated totals from transactions
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} Aggregated data (totalDebits, totalCredits, netBalance, transactionCount)
 */
function aggregateTransactions(transactions) {
  if (!transactions || transactions.length === 0) {
    return {
      totalDebits: 0,
      totalCredits: 0,
      netBalance: 0,
      transactionCount: 0
    };
  }
  
  let totalDebits = 0;
  let totalCredits = 0;
  
  transactions.forEach((transaction) => {
    // Parse amount - handle both number and string formats
    let amount = 0;
    if (typeof transaction.montant === 'number') {
      amount = transaction.montant;
    } else if (typeof transaction.montant === 'string') {
      // Remove currency symbols and spaces, replace comma with dot
      amount = parseFloat(transaction.montant.replace(/[^\d,.-]/g, '').replace(',', '.'));
    }
    
    // Categorize as debit or credit
    if (amount < 0) {
      totalDebits += amount;
    } else if (amount > 0) {
      totalCredits += amount;
    }
  });
  
  const netBalance = totalCredits + totalDebits; // totalDebits is negative
  
  return {
    totalDebits: parseFloat(totalDebits.toFixed(2)),
    totalCredits: parseFloat(totalCredits.toFixed(2)),
    netBalance: parseFloat(netBalance.toFixed(2)),
    transactionCount: transactions.length
  };
}

/**
 * Format transaction for output
 * @param {Object} transaction - Raw transaction object
 * @returns {Object} Formatted transaction
 */
function formatTransaction(transaction) {
  let amount = 0;
  if (typeof transaction.montant === 'number') {
    amount = transaction.montant;
  } else if (typeof transaction.montant === 'string') {
    amount = parseFloat(transaction.montant.replace(/[^\d,.-]/g, '').replace(',', '.'));
  }
  
  return {
    date: transaction.dateOperation || transaction.date || 'N/A',
    label: transaction.libelleOperation || transaction.libelle || 'N/A',
    amount: parseFloat(amount.toFixed(2)),
    type: amount < 0 ? 'debit' : 'credit'
  };
}

/**
 * Process data: format transactions and calculate aggregates
 * @param {Object} data - Data object with transactions array
 * @returns {Object} Processed data with formatted transactions and aggregates
 */
function processData(data) {
  const formattedTransactions = data.transactions.map(formatTransaction);
  const aggregates = aggregateTransactions(data.transactions);
  
  return {
    period: data.period,
    dateRange: data.dateRange,
    transactions: formattedTransactions,
    aggregates: aggregates
  };
}

module.exports = {
  aggregateTransactions,
  formatTransaction,
  processData
};

const { session, getListAccounts } = require('js-creditagricole-particuliers');

/**
 * Authenticate with Credit Agricole and return session with account info
 * @param {string} accountNumber - Bank account number
 * @param {string} password - Password (as string)
 * @param {string} region - Department number
 * @returns {Promise<{session: Object, account: Object}>}
 */
async function authenticate(accountNumber, password, region) {
  try {
    // Login to Credit Agricole
    const newSession = await session.login(accountNumber, password, region);
    
    // Get list of accounts
    const accounts = await getListAccounts(newSession);
    
    // Find the specific account
    const account = accounts.find((acc) => acc.numeroCompte === accountNumber);
    
    if (!account) {
      throw new Error(`Account ${accountNumber} not found in the session`);
    }
    
    return {
      session: newSession,
      account: account
    };
  } catch (error) {
    if (error.message.includes('login')) {
      throw new Error('Authentication failed. Please check your credentials (account number, password, region).');
    }
    throw error;
  }
}

module.exports = { authenticate };

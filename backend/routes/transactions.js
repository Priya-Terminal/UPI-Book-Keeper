const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');

router.post('/transactions', async (req, res) => {
  try {
    const { provider, transactionId, transactionAmount, transactionStatus, date } = req.body;

    const transaction = new Transaction({
      provider,
      transactionId,
      transactionAmount,
      transactionStatus,
      date
    });

    console.log('Saving transaction:', transaction);
    await transaction.save();
    console.log('Transaction saved successfully');

    res.status(200).json({ message: 'Transaction saved successfully' });
  } catch (error) {
    console.error('Error saving transaction:', error);
    res.status(500).json({ error: 'Error saving transaction' });
  }
});

router.get('/transactions', async (req, res) => {
    try {
        console.log('Fetching transactions...');
        const transactions = await Transaction.find();
        console.log('Transactions fetched:', transactions);
  
      res.status(200).json(transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ error: 'Error fetching transactions' });
    }
  });

module.exports = router;

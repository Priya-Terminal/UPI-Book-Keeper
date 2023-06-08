const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  provider: {
    type: String,
    required: true
  },
  transactionId: {
    type: String,
    required: true
  },
  transactionAmount: {
    type: Number,
    required: true
  },
  transactionStatus: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;

export function extractGooglePayData(extractedText) {
  const transactions = [];
  const googlePayRegex =  /(((\d{1,3},\d{3}).*?)?(Payment failed|Completed).*?((?:Jan|Feb|Mar|Apr|May|June|July|Aug|Sep|Oct|Nov|Dec)\s\d{1,2},\s\d{4}(?:\sat)?\s\d{1,2}:\d{2}\s(?:AM|PM)|(?:0?[1-9]|[12][0-9]|3[01]) (?:Jan|Feb|Mar|Apr|May|June|July|Aug|Sep|Oct|Nov|Dec) 20[0-9]{2} (?:2[0-3]|[01][0-9]):(?:[0-5][0-9]))(.*?UPI transaction ID( [A-Z0-9+]+))?)/gis;
  let match;
  while ((match = googlePayRegex.exec(extractedText)) !== null) {
    let transactionData = {
      provider: 'GooglePay',
      match: match[0],
      transactionId: match[7],
      transactionAmount: match[3],
      transactionStatus: match[4],
      date: match[5]
    };
    transactions.push(transactionData);
  }
  return transactions;
};


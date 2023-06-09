export function extractBhimData(extractedText) {
  const transactions = [];
  const bhimRegex = /(FAILED|SUCCESS).*?(?:(\d{4})|((\d{1,3},)?\d{1,3},\d{3})|(\d{3})).*?(Transaction ID .*? (\d+) .*?Remarks)/gis;

  let match;
  while ((match = bhimRegex.exec(extractedText)) !== null) {
    let transactionData = {
      provider: 'BHIM',
      match: match[0],
      transactionId: match[7],
      transactionAmount: match[3] || match[5],
      transactionStatus: match[1],
      date: "Not Available"
    };
    transactions.push(transactionData);
  }
  return transactions;
};



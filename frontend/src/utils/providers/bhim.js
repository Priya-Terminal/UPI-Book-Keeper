export function extractBhimData(extractedText) {
  const transactions = [];
  const bhimRegex = /(FAILED|SUCCESS).*?(?:(\d{4})|((\d{1,3},)?\d{1,3},\d{3})|(\d{3})).*?((?:Transaction|Tansaciion|Transacton) (?:ID|I|D|1D) .*? (\d+) .*?Remarks)/gis;
  let match;
  while ((match = bhimRegex.exec(extractedText)) !== null) {
    console.log("Match found:", match);

    let transactionData = {
      provider: 'bhim',
      match: match[0],
      transactionId: match[7],
      transactionAmount: match[3] || match[5],
      transactionStatus: match[1],
      date: "Not Available"
    };
    transactions.push(transactionData);
  }
  console.log("Total transactions:", transactions.length);
  return transactions;
};



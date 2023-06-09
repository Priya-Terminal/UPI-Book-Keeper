export function extractPaytmData(extractedText) {
  const transactions = [];
  const paytmRegex = /(Sent Successfully|Payment Failed|Transfer Pending|Transfer Failed|Money Received).*?(?<=Rupees)(.*)(?=Only).*?((\d{2}:\d{2} [AP]M, \d{2} [A-Z][a-z]+ \d{4})|(\d{2} [A-Z][a-z]+ \d{4}, \d{2}:\d{2} [AP]M)).*?((UPI Ref(?:erence)? No:\s(\d+))|(UPI Reference ID:\s([A-Za-z0-9]+)))/gs;

  let match;

  while ((match = paytmRegex.exec(extractedText)) !== null) {
    let transactionData = {
      provider: 'paytm',
      match: match[0],
      transactionId: match[6],
      transactionAmount: match[2],
      transactionStatus: match[1],
      date: match[3]
    };
    transactions.push(transactionData);
  }
  return transactions;
};




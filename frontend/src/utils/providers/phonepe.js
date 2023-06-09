export function extractPhonePeData(extractedText) {
  const transactions = [];
  const phonePeRegex =
    /(Transaction Successful|Transaction Failed)\s((?:0[1-9]|1[0-2]):(?:[0-5][0-9]) (?:am|pm) on (?:0?[1-9]|[12][0-9]|3[01]) (?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) 20[0-9]{2}).*?(?:(\d{4})|((\d{1,3},)?\d{1,3},\d{3})|(\d{3})).*?(Transaction ID( [A-Z0-9+]+))/gis;

    let match;
    while ((match = phonePeRegex.exec(extractedText)) !== null) {
      console.log("Match found:", match[0]);

    const transactionData = {
      provider: "PhonePe",
      match: match[0],
      id: match[7],
      amount: match[3] || match[5],
      status: match[1],
      date: match[2],
    };

    transactions.push(transactionData);
  }

  console.log("Total transactions:", transactions.length);
  return transactions;
}

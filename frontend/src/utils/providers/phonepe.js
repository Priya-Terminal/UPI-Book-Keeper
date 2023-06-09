export function extractPhonePeData(extractedText) {
  const transactions = [];
  const phonePeRegex =
    /(Transaction Successful|Transaction Failed)\s((?:0[1-9]|1[0-2]):(?:[0-5][0-9]) (?:am|pm) on (?:0?[1-9]|[12][0-9]|3[01]) (?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) 20[0-9]{2}).*?(?:(\d{4})|((\d{1,3},)?\d{1,3},\d{3})|(\d{3})).*?(Transaction ID( [A-Z0-9+]+))/gis;

  const [match, status, date, amount1, amount2, , amount3, id] =
    extractedText.match(phonePeRegex);

  const transactionData = {
    provider: "PhonePe",
    match,
    id,
    amount: amount1 || amount2 || amount3,
    status,
    date,
  };

  // convert date to timestamp
  if (date) {
    const timestamp = new Date(date).getTime();
    transactionData.date = timestamp;

    if (isNaN(timestamp)) {
      transactionData.date = Date.now();
    } else {
      transactionData.date = timestamp;
    }
  } else {
    transactionData.date = Date.now();
  }

  return transactionData;
}

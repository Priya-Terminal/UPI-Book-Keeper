export function extractGooglePayData(extractedText) {
  const googlePayRegex = /(((\d{1,3},\d{3}).*?)?(Payment failed|Completed).*?((?:Jan|Feb|Mar|Apr|May|June|July|Aug|Sep|Oct|Nov|Dec)\s\d{1,2},(?:\s)?\d{4}(?:\sat)?\s\d{1,2}(?::)?\d{2}\s(?:AM|PM)|(?:0?[1-9]|[12][0-9]|3[01]) (?:Jan|Feb|Mar|Apr|May|June|July|Aug|Sep|Oct|Nov|Dec) 20[0-9]{2} (?:2[0-3]|[01][0-9]):(?:[0-5][0-9]))(.*?UPI transaction (?:ID|D|1D)( [A-Z0-9+]+))?)/gi;
console.log(extractedText.match(googlePayRegex), "extractedtext");

let m;

if ((m = googlePayRegex.exec(extractedText)) !== null) {
    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
        console.log(`Found match, group ${groupIndex}: ${match}`);
    });
  }
  const [match, , , amount, status, date, , id] = m;

  let transactionData = {
    provider: "GooglePay",
    match,
    id,
    amount,
    status,
    date,
  };
  console.log(transactionData,"transactiondata");
  // convert date to timestamp
  if (date) {
    const timestamp = new Date(date).getTime();
    if (isNaN(timestamp)) {
      transactionData.date = Date.now();
    } else {
      transactionData.date = timestamp;
    }
  } else {
    transactionData.date = Date.now();
  }

  if (amount) {
    transactionData.amount = parseFloat(amount.replace(/,/g, ""));
  }
  return transactionData;
}


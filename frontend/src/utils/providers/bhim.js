export function extractBhimData(extractedText) {
  const transactions = [];
  const bhimRegex1 =
    /(\w+)\sto\s?upi\s?id.*amount transact.+[1|i]D\s.([\d\.]+)\s(\d+)/i;
  const bhimRegex2 = /(failed|success)[^\d]*([\d\.,]+).+\s(\w+)\s\w+\supi\s?[1i]?d.*transact.+\s(\d{5,})/i;

  let [match, status, amount, id] = extractedText.match(bhimRegex1) || [];

  if (!match) {
    [match, , amount, status, id] = extractedText.match(bhimRegex2) || [];
  }


  let transactionData = {
    provider: "BHIM",
    match,
    id,
    amount: parseFloat(amount.replace(/,/g, "")),
    status,
    date: Date.now(),
  };
  return transactionData;
}

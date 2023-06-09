export function extractPhonePeData(extractedText) {
  const phonePeRegex = /(\w+)\s(from|to)\s[^\d]+\s([\d,]+).*transact.*(T\d+)/i;

  const [match, status, , amount, id] = extractedText.match(phonePeRegex);

  const transactionData = {
    provider: "PhonePe",
    match,
    id,
    amount: parseFloat(amount.replace(/,/g, "")),
    status: !/payment/i.test(status) ? "Success" : "Failed",
    date: Date.now(),
  };

  return transactionData;
}

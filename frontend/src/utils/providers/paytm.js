export function extractPaytmData(extractedText) {
  const paytmRegex =
    /(success|failed|received)[^\d]*([\d,]+)\s.+(rupees .).*UPI\s?Ref\s?No:\s?(\d+)/i;

  const [match, status, amount, testString, id] =
    extractedText.match(paytmRegex);

  let transactionData = {
    provider: "paytm",
    match: match[0],
    id,
    amount: /t/i.test(testString)
      ? parseFloat(amount.replace(/,/g, ""))
      : parseFloat(amount.replace(/^3/, "").replace(/,/g, "")),
    status,
    date: Date.now(),
  };
  return transactionData;
}

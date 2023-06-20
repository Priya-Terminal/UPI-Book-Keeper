export function extractPaytmData(extractedText) {
  const paytmRegex =
    /(success|failed|received|pending)[^\d]*([\d,]+).*(rupees .).*(?:UPI|amount)\s?(?:Ref|Reference)\s?(?:No|ID):\s?(\d+|\w+)/igs;

    let m;

if ((m = paytmRegex.exec(extractedText)) !== null) {
    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
        console.log(`Found match, group ${groupIndex}: ${match}`);
    });
  }
console.log(m, "m");
  const [match, status, amount, testString, id] = m ;
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

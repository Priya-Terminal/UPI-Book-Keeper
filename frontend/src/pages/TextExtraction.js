import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import "./TextExtraction.css";


function TextExtraction() {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [transactionDetails, setTransactionDetails] = useState([]);

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    extractTextFromImage(selectedFile);
  };

  const extractTextFromImage = (imageFile) => {
    Tesseract.recognize(imageFile)
      .then((result) => {
        const extractedText = result.data.text;
        setExtractedText(extractedText);
        processExtractedText(extractedText);
      })
      .catch((error) => {
        console.error('Error extracting text:', error);
      });
  };

  const processExtractedText = (extractedText) => {
    // Extracting  transaction details using regex or string manipulation techniques
    const amountRegex = /Amount:\s+(\d+\.\d+)/;
    const dateRegex = /Date:\s+(\d{2}\/\d{2}\/\d{4})/;
    const timeRegex = /Time:\s+(\d{2}:\d{2}:\d{2})/;
    const payerRegex = /Payer:\s+(.+)/;

    const transactions = [];

    // Spliting the extracted text into lines
    const lines = extractedText.split('\n');

    // Processing each line to extract transaction details
    lines.forEach((line) => {
      const amountMatch = line.match(amountRegex);
      const dateMatch = line.match(dateRegex);
      const timeMatch = line.match(timeRegex);
      const payerMatch = line.match(payerRegex);

      if (amountMatch && dateMatch && timeMatch && payerMatch) {
        const transaction = {
          amount: parseFloat(amountMatch[1]),
          date: dateMatch[1],
          time: timeMatch[1],
          payerName: payerMatch[1]
        };
        transactions.push(transaction);
      }
    });

    // Update the transactionDetails state with the extracted transactions
    setTransactionDetails(transactions);
  };

  return (
    <div>
      <h1>Text Extraction</h1>
      <input type="file" accept="image/*" onChange={handleFileUpload} />

      {extractedText && (
        <div>
          <h2>Extracted Text:</h2>
          <p>{extractedText}</p>
        </div>
      )}

      {transactionDetails.length > 0 && (
        <div>
          <h2>Transaction Details:</h2>
          <table>
            <thead>
              <tr>
                <th>Amount</th>
                <th>Date</th>
                <th>Time</th>
                <th>Payer's Name</th>
              </tr>
            </thead>
            <tbody>
              {transactionDetails.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.amount}</td>
                  <td>{transaction.date}</td>
                  <td>{transaction.time}</td>
                  <td>{transaction.payerName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TextExtraction;

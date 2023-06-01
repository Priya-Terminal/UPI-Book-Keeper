import React, { useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import "./TextExtraction.css";
import  extractData  from './dataextractionutils';


function TextExtraction() {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [transactionDetails, setTransactionDetails] = useState([]);
 
  const providerRegexes = {
    PhonePe: [
      /PhonePe/g,
    ],
    GooglePay: [
      /(?:UPI transaction ID).*/g,
    ],
    Paytm: [
      /paytm/g,
    ],
    BHIM: [
      /(UPI\s?ID|UPI\s?Ref\s?No:|UPIID)/g,
    ],
  };

  const identifyProvider = (extractedText) => {
    const providers = ["paytm", "phonepe", "googlepay", "bhim"];

    for (const provider of providers) {
      if (extractedText.toLowerCase().includes(provider)) {
        return provider;
      }
    }

    return null; 
  };

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
        console.log("Extracted Text:", extractedText);
        processExtractedText(extractedText);
      })
      .catch((error) => {
        console.error('Error extracting text:', error);
      });
  };

  const processExtractedText = (extractedText) => {
    const transactions = [];
    console.log("Processing Extracted Text...");
   
    const lines = extractedText.split('\n');

  lines.forEach((line) => {
    const provider = identifyProvider(line);

    if (provider) {
      transactions.push({
        provider: provider,
        match: line,
        group1: "" 
      });

      console.log("Match found:", line);
    }
  });

  console.log("Transaction Details:", transactions);
  setTransactionDetails(transactions);
};
   
 useEffect(() => {
    extractData("Payment to PhonePe, UPI transaction ID: 123456, UPI Ref No: 789012, UPIID, paytm");
  }, []);

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
              <th>Provider</th>
              <th>Match</th>
              <th>Group 1</th>
              </tr>
            </thead>
            <tbody>
              {transactionDetails.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.provider}</td>
                  <td>{transaction.match}</td>
                  <td>{transaction.group1}</td>
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

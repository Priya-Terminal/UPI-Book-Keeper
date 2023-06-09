import React, { useState, useEffect, useRef } from "react";

import {
  extractTextFromImage,
  identifyProvider,
  extractData,
} from "../utils/textExtractionUtils";
import "./TextExtraction.css";

function resizeImage(dataUrl, callback) {
  // Create an image object
  let img = new Image();

  // Once the image is loaded...
  img.onload = function() {
    // Create a canvas and context to draw to
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');

    // Calculate the best scale to fit to the max sizes
    let scale = Math.min(450 / img.width, 800 / img.height);

    // Set the canvas width and height to the scaled image size
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    // Draw the scaled image on the canvas
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Get a Data URL from the canvas
    let scaledDataUrl = canvas.toDataURL();

    // Invoke the callback with the result
    callback(scaledDataUrl);
  };

  // Start loading the image
  img.src = dataUrl;
}

function CameraCapture({ setFile, file }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    try {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        })
        .catch((error) => {
          console.error("Error accessing camera:", error);
        });
    } catch (error) {
      console.error("Error in accessing camera:", error);
    }
  }, [file]);

  const handleCaptureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    console.log(video.videoWidth, video.videoHeight);
    // Calculate the best scale to fit to the max sizes
    let scale = Math.min(450 / video.videoWidth, 800 / video.videoHeight);
    canvas.width = video.videoWidth * scale;
    canvas.height = video.videoHeight * scale;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");
    setFile(dataUrl);
    video.srcObject.getTracks().forEach((track) => track.stop());
  };

  return (
    <div>
      <h1>Camera Capture</h1>
      <button onClick={handleCaptureImage}>Capture Image</button>
      {file && (
        <div>
          <h2>Captured Image:</h2>
          <img src={file} alt="Captured Image" />
          <button onClick={() => setFile(null)}>Retake Image</button>
        </div>
      )}
      <video ref={videoRef} style={{ display: file ? "none" : "block" }} />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}

function TextExtraction({ isUserLoggedIn }) {
  const [shopId, setShopId] = useState(null);
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [transactionDetails, setTransactionDetails] = useState(null);

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    // convert the file to data url
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = () => {
      resizeImage(reader.result, setFile);
    };

    console.log(selectedFile);
  };

  useEffect(() => {
    if (!shopId && localStorage.getItem("user")) {
      const userItem = localStorage.getItem("user");
      console.log("User item from localStorage:", userItem);

      const parsedUser = JSON.parse(userItem);
      console.log("Parsed user object from localStorage:", parsedUser);

      if (parsedUser.shop) {
        console.log("Shop ID from localStorage:", parsedUser.shop);
        setShopId(parsedUser.shop);
      } else {
        console.log("Shop ID is not present in the user object.");
      }
    }

    if (file) {
      console.log(file);
      extractTextFromImage(file)
        .then((result) => {
          setExtractedText(result);
          const provider = identifyProvider(result);
          console.log(provider, "uploaded file");
          const data = extractData(result, provider);
          if (data) {
            setTransactionDetails(data);
          }
        })
        .catch((error) => {
          console.error("Error extracting text:", error);
        });
    }
   }, [file, shopId]);

  return !isUserLoggedIn ? (
    <div>
      <h1>Please login to view this page</h1>
    </div>
  ) : (
    <div>
      <h1>Text Extraction</h1>
      <input type="file" accept="image/*" onChange={handleFileUpload} />
      {/* take this input or have a button to access camera and try to get data from image that we get from camera by capturing the image */}
      <CameraCapture file={file} setFile={setFile} />

      {extractedText && (
        <div>
          <h2>Extracted Text:</h2>
          <p>{extractedText}</p>
        </div>
      )}

      {transactionDetails && (
        <div>
          <h2>Transaction Details:</h2>
          <table>
            <thead>
              <tr>
                <th>Provider</th>
                <th>Transaction ID</th>
                <th>Transaction Amount</th>
                <th>Transaction Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{transactionDetails.provider}</td>
                <td>{transactionDetails.id}</td>
                <td>{transactionDetails.amount}</td>
                <td>{transactionDetails.status}</td>
                <td>{new Date(transactionDetails.date).toDateString()}</td>
              </tr>
            </tbody>
          </table>
          <button
            onClick={() => {
              console.log(transactionDetails);
              fetch("http://localhost:8000/transaction", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  ...transactionDetails,
                  image: file,
                  shop: shopId,
                }),
              })
                .then((response) => {
                  console.log(response);
                  return response.json()
                })
                .then((data) => {
                  console.log("Success:", data);
                })
                .catch((error) => {
                  console.error("Error:", error);
                });
            }}
          >
            Upload to Database
          </button>
        </div>
      )}
    </div>
  );
}

export default TextExtraction;

// import React, { useState, useEffect } from 'react';
// import Tesseract from 'tesseract.js';
// import { extractTextFromImage } from './textExtractionUtils';
// import { bhimRegex, extractBhimData } from '../providers/bhim';
// import { googlePayRegex, extractGooglePayData } from '../providers/googlepay';
// import { phonePeRegex, extractPhonePeData } from '../providers/phonepe';
// import { paytmRegex, extractPaytmData } from '../providers/paytm';
// import "./TextExtraction.css";

// function TextExtraction() {
//   const [file, setFile] = useState(null);
//   const [extractedText, setExtractedText] = useState("");
//   const [transactionDetails, setTransactionDetails] = useState([]);

//   const providerRegexes = {
//     PhonePe:
//     /(Transaction Successful|Transaction Failed)\s((?:0[1-9]|1[0-2]):(?:[0-5][0-9]) (?:am|pm) on (?:0?[1-9]|[12][0-9]|3[01]) (?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) 20[0-9]{2}).*?(?:(\d{4})|((\d{1,3},)?\d{1,3},\d{3})|(\d{3})).*?(Transaction ID( [A-Z0-9+]+))/gis,
//     GooglePay:
//       /(((\d{1,3},\d{3}).*?)?(Payment failed|Completed).*?((?:Jan|Feb|Mar|Apr|May|June|July|Aug|Sep|Oct|Nov|Dec)\s\d{1,2},\s\d{4}(?:\sat)?\s\d{1,2}:\d{2}\s(?:AM|PM)|(?:0?[1-9]|[12][0-9]|3[01]) (?:Jan|Feb|Mar|Apr|May|June|July|Aug|Sep|Oct|Nov|Dec) 20[0-9]{2} (?:2[0-3]|[01][0-9]):(?:[0-5][0-9]))(.*?UPI transaction ID( [A-Z0-9+]+))?)/gis,
//     Paytm:
//       /(Sent Successfully|Payment Failed|Transfer Pending|Transfer Failed|Money Received).*?(?<=Rupees)(.*)(?=Only).*?((\d{2}:\d{2} [AP]M, \d{2} [A-Z][a-z]+ \d{4})|(\d{2} [A-Z][a-z]+ \d{4}, \d{2}:\d{2} [AP]M)).*?((UPI Ref(?:erence)? No:\s(\d+))|(UPI Reference ID:\s([A-Za-z0-9]+)))/gs,
//     BHIM:
//       /(FAILED|SUCCESS).*?(?:(\d{4})|((\d{1,3},)?\d{1,3},\d{3})|(\d{3})).*?(Transaction ID .*? (\d+) .*?Remarks)/gis,
//   };

//   const identifyProvider = (extractedText) => {
//     const providers = ["paytm", "phonepe", "googlepay", "bhim"];

//     for (const provider of providers) {
//       if (extractedText.toLowerCase().includes(provider)) {
//         return provider;
//       }
//     }

//     return null;
//   };

//   const handleFileUpload = (event) => {
//     const selectedFile = event.target.files[0];
//     setFile(selectedFile);
//     extractTextFromImage(selectedFile);
//   };

//   const processExtractedText = (extractedText) => {
//     const transactions = [];
//     extractedText = extractedText.replace(/\n/g, " ")
//     console.log("Processing Extracted Text...", extractedText);
//     const regexKeys = Object.keys(providerRegexes)
//     regexKeys.forEach((provider,index, arr) => {
//     const regex = providerRegexes[provider];
//     console.log("regex========", regex)
//     // const match = regex.match(extractedText);
//     let m;
//     let matchFound = false;
//     while ((m = regex.exec(extractedText)) !== null) {

//         console.log("=============", m)
//         if (m.index === regex.lastIndex) {
//             regex.lastIndex++;
//         }
//         let transactionData = {}
//         if (provider == 'Paytm'){
//           transactionData = {
//             provider: provider,
//             match: m[0],
//             transactionId: m[6],
//             transactionAmount: m[2],
//             transactionStatus: m[1],
//             date: m[3]
//           }
//         }
//         else if (provider == 'GooglePay'){
//           transactionData = {
//             provider: provider,
//             match: m[0],
//             transactionId: m[7],
//             transactionAmount: m[3],
//             transactionStatus: m[4],
//             date: m[5]
//           }
//         }
//         else if (provider == 'PhonePe'){
//           transactionData = {
//             provider: provider,
//             match: m[0],
//             transactionId: m[7],
//             transactionAmount: m[3] || m[4] || m[6],
//             transactionStatus: m[1],
//             date: m[2]
//           }
//         }
//         else if (provider == 'BHIM'){
//           transactionData = {
//             provider: provider,
//             match: m[0],
//             transactionId: m[7],
//             transactionAmount: m[3] || m[5],
//             transactionStatus: m[1],
//             date: "Not Available"
//           }
//         }
//         transactions.push(transactionData);
//         m.forEach((match, groupIndex) => {
//             console.log(`Found match, group ${groupIndex}: ${match}`);
//         });
//         matchFound = true;
//     }
//     if (matchFound){
//       arr.length = index + 1;
//     }
//     });

//     console.log("Transaction Details:", transactions);
//     setTransactionDetails(transactions);
//   };

//   const getData = (extractedText) => {
//     const transactionIdRegex = /(?:Transaction ID|order id):\s?(\S+)/i;
//     const transactionAmountRegex = /(?:(?<=Paid to\s)[\w\s]+(\d{1,3}(?:,\d{3})*)(?:\.\d{2})?)/i;
//     const transactionStatusRegex = /Transaction (?:Successful|Failed)/i;
//     const dateRegex = /(?:on\s)?(\d{2}\s\w+\s\d{4})/i;

//     const transactionIdMatch = extractedText.match(transactionIdRegex);
//     const transactionAmountMatch = extractedText.match(transactionAmountRegex);
//     const transactionStatusMatch = extractedText.match(transactionStatusRegex);
//     const dateMatch = extractedText.match(dateRegex);

//     const transactionId = transactionIdMatch ? transactionIdMatch[1] : "";
//     const transactionAmount = transactionAmountMatch ? transactionAmountMatch[1] : "";
//     const transactionStatus = transactionStatusMatch ? transactionStatusMatch[0] : "";
//     const date = dateMatch ? dateMatch[1] : "";

//     return {
//       transactionId,
//       transactionAmount,
//       transactionStatus,
//       date,
//     };
//   };

//   useEffect(() => {

//     const extractedText = "Payment to PhonePe, UPI transaction ID: 123456, UPI Ref No: 789012, UPIID, paytm";
//     const data = getData(extractedText);
//     console.log("Data:", data);
//   }, []);

//   return (
//     <div>
//       <h1>Text Extraction</h1>
//       <input type="file" accept="image/*" onChange={handleFileUpload} />

//       {extractedText && (
//         <div>
//           <h2>Extracted Text:</h2>
//           <p>{extractedText}</p>
//         </div>
//       )}

//       {transactionDetails.length > 0 && (
//         <div>
//           <h2>Transaction Details:</h2>
//           <table>
//             <thead>
//               <tr>
//                 <th>Provider</th>
//                 <th>Transaction ID</th>
//                 <th>Transaction Amount</th>
//                 <th>Transaction Status</th>
//                 <th>Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {transactionDetails.map((transaction, index) => (
//                 <tr key={index}>
//                   <td>{transaction.provider}</td>
//                   <td>{transaction.transactionId}</td>
//                   <td>{transaction.transactionAmount}</td>
//                   <td>{transaction.transactionStatus}</td>
//                   <td>{transaction.date}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// export default TextExtraction;

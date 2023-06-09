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

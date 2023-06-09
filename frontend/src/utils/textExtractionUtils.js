import Tesseract from "tesseract.js";
import { extractPaytmData } from "./providers/paytm";
import { extractPhonePeData } from "./providers/phonepe";
import { extractGooglePayData } from "./providers/googlepay";
import { extractBhimData } from "./providers/bhim";

export async function extractTextFromImage(image) {
  try {
    const { data } = await Tesseract.recognize(image, "eng");
    return data.text;
  } catch (error) {
    console.error("Error extracting text from image:", error);
    throw error;
  }
}

export function identifyProvider(extractedText) {
  const providerPatterns = {
    paytm: [/paytm/, /Paytm/, /UPI Ref No: \d+/],
    phonepe: [/phonepe/i, /phone pe/],
    googlepay: [/google pay/, /gpay/, /g pay/, /UPI transaction ID/],
    bhim: [/bhim/, /remarks/i, /transaction id/i],
  };

  for (let provider in providerPatterns) {
    for (let pattern of providerPatterns[provider]) {
      if (pattern.test(extractedText)) {
        return provider;
      }
    }
  }

  return null;
}

export function extractData(extractedText, provider) {
  extractedText = extractedText.replace(/\n/g, " ");
  console.log(extractedText);

  let result = null;

  switch (provider) {
    case "paytm":
      result = extractPaytmData(extractedText);
      break;
    case "phonepe":
      result = extractPhonePeData(extractedText);
      break;
    case "googlepay":
      result = extractGooglePayData(extractedText);
      break;
    case "bhim":
      result = extractBhimData(extractedText);
      break;
    default:
      break;
  }

  console.log(result);

  return result;
}

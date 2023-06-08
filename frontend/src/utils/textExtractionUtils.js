import Tesseract from 'tesseract.js';
import { extractPaytmData } from '../providers/paytm';
import { extractPhonePeData } from '../providers/phonepe';
import { extractGooglePayData } from '../providers/googlepay';
import { extractBhimData } from '../providers/bhim';

export async function extractTextFromImage(image) {
  try {
    const { data } = await Tesseract.recognize(image, 'eng' );
    return data.text;
  } catch (error) {
    console.error('Error extracting text from image:', error);
    throw error;
  }
}

export function identifyProvider(extractedText) {
  const providers = ["paytm", "phonepe", "googlepay", "bhim"];

  for (const provider of providers) {
    if (extractedText.toLowerCase().includes(provider)) {
      return provider;
    }
  }

  return null;
}

export function extractData(extractedText, provider) {
    console.log(provider,"hi" )
    extractedText = extractedText.replace(/\n/g, " ")
    console.log(extractedText)
    const providers = ["paytm", "phonepe", "googlepay", "bhim"];
    let result = [];
    providers.forEach((provider,index, arr) => {
         {
            if(provider === "paytm") {
                result = extractPaytmData(extractedText);
                console.log(result,'paytm');
            }
            else if (provider === 'googlepay'){
                result = extractGooglePayData(extractedText);
                console.log(result,'googlepay');
            }
            else if (provider === 'phonepe'){
               result = extractPhonePeData(extractedText);
               console.log(result,'phonepe');
            }
            else if (provider === 'bhim'){
                result = extractBhimData(extractedText);
                console.log(result,'bhim');
             }
            
             if (result.length>0 &&  Object.keys(result[0]).length>0){
                console.log('inside if')
                       arr.length = index + 1;
                    }
    
          }
        
        })

        return result;
}

    


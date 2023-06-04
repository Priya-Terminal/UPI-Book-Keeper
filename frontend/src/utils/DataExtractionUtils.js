export const extractData = (subject) => {
  const regexes = [
    /PhonePe/g,
    /(UPI transaction ID:.*)/g,
    /(UPI\s?ID|UPI\s?Ref\s?No:|UPIID)/g,
    /paytm/g
  ];
  
  const extractedData = [];

  regexes.forEach((regex) => {
    let matches;
    while ((matches = regex.exec(subject)) !== null) {
      const match = matches[0]; 
      const group1 = matches[1]; 
      extractedData.push({
          match: match,
          group1: group1
        });
      }
    });
  
    return extractedData;
  };
      
export default extractData;
  
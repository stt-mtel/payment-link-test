const { getSecretValue } = require("./getSecretValue");

const axios = require("axios");

exports.getSCBQRCode = async ({ id, amount, title, description }) => {
  const scbApiKey = await getSecretValue("SCB_API_KEY");
  const scbSecretKey = await getSecretValue("SCB_SECRET_KEY");
  const config = {
    headers: {
      "Content-Type": "application/json",
      "accept-language": "EN",
      requestUId: id,
      resourceOwnerId: scbApiKey,
    },
  };
  let response = await axios.post(
    process.env.SCB_GET_TOKEN_URI,
    {
      applicationKey: scbApiKey,
      applicationSecret: scbSecretKey,
    },
    config
  );

  const accessToken = response.data.data.accessToken;
  config.headers.authorization = "Bearer " + accessToken;
  
  try{
    response = await axios.post(
      process.env.SCB_CREATE_QR_CODE_URI, 
      { 
        qrType: "PP",
        ppType: "BILLERID",
        ppId: process.env.SCB_BILLER_ID,
        amount: amount,
        ref1: title, // Only English capital letter & number only [limit: 20]
        ref2: description, // Only English capital letter & number only [limit: 20]
        ref3: process.env.SCB_REFERENCE_3_PREFIX,
      }, 
      config);
    return response.data.data.qrImage;
  }catch(e){
    console.error(e);
    throw Error('Error: Please contact an administrator');
  }
};

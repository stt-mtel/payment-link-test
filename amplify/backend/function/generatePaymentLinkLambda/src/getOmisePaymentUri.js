
const { getSecretValue } = require('./getSecretValue');

exports.getOmisePaymentUri = async ({ amount, currency, title, description }) => {  
    const omisePublicKey = await getSecretValue('OMISE_PUBLIC_KEY');
    const omiseSecretKey = await getSecretValue('OMISE_SECRET_KEY');
  
    const omise = require("omise")({
      publicKey: omisePublicKey,
      secretKey: omiseSecretKey,
    });
  
    const link = {
      amount: amount * 100,
      currency,
      multiple: false,
      title,
      description,
    };
    try{
        const response = await omise.links.create(link);
        return response.payment_uri;
    }catch(e){
        throw Error(JSON.stringify(e));
    }
  };
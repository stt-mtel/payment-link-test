import { getOmisePaymentUri } from "./getOmisePaymentUri";
import { getSCBQRCode } from "./getScbQrCode";

exports.handler = async (event) => {
  const payload = event.body;
  switch (payload.method) {
    case "creditCard":
      const paymentUri = getOmisePaymentUri(payload);
      return generateResponse(200, { paymentUri });
    case "qrCode":
      const qrCodeBase64 = getSCBQRCode(payload);
      return generateResponse(200, { qrCodeBase64 });
    default:
      return generateResponse(400, {
        message: "Invalid method",
      });
  }
};

const generateResponse = (statusCode, body) => {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
    },
    body: JSON.stringify(body),
  };
};

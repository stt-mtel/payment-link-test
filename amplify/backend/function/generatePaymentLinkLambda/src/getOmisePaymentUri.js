const axios = require("axios");
const graphql = require("graphql");
const { print } = graphql;
const { updateTransaction } = require("./graphql/mutations");
const { getSecretValue } = require("./getSecretValue");

exports.getOmisePaymentUri = async ({
  id,
  amount,
  currency,
  title,
  description,
}) => {
  const omisePublicKey = await getSecretValue("OMISE_PUBLIC_KEY");
  const omiseSecretKey = await getSecretValue("OMISE_SECRET_KEY");

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
  try {
    const response = await omise.links.create(link);
    await callAppSync(updateTransaction, {
      input: {
        id,
        reference: response.id,
      },
    });
    return response.payment_uri;
  } catch (e) {
    console.error(e);
    throw Error("Error: Please contact an administrator");
  }
};

const callAppSync = async (query, variables) => {
  return await axios({
    url: process.env.API_MTELPAYMENT_GRAPHQLAPIENDPOINTOUTPUT,
    method: "post",
    headers: {
      "x-api-key": process.env.API_MTELPAYMENT_GRAPHQLAPIKEYOUTPUT,
    },
    data: {
      query: print(query),
      variables,
    },
  });
};

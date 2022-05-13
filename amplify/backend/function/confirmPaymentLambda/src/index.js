/* Amplify Params - DO NOT EDIT
	API_MTELPAYMENT_GRAPHQLAPIENDPOINTOUTPUT
	API_MTELPAYMENT_GRAPHQLAPIIDOUTPUT
	API_MTELPAYMENT_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const axios = require("axios");
const graphql = require("graphql");
const { print } = graphql;
const { listTransactions } = require("./graphql/queries");
const { updateTransaction } = require("./graphql/mutations");

exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  const payload = JSON.parse(event.body);
  const referenceId = payload.billPaymentRef1;
  if (referenceId) {
    const transactionsData = await callAppSync(listTransactions, {
      filter: {
        reference: {
          eq: referenceId,
        },
      },
    });

    const result = transactionsData.data.data.listTransactions;
    if (result.items.length > 0) {
      const itemId = result.items[0].id;
      const updatedTransaction = await callAppSync(updateTransaction, {
        input: {
          id: itemId,
          status: "paid",
          paymentDate: new Date(),
        },
      });

      const updatingResult = updatedTransaction.data.data.updateTransaction;
      return {
        statusCode: 200,
        body: JSON.stringify(updatingResult),
      };
    }
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

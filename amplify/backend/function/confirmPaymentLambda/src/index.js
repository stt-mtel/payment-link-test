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

 const axios = require('axios');
 const gql = require('graphql-tag');
 const graphql = require('graphql');
 const { print } = graphql;
 
 const listTransactions = gql`
   query listTransactions(
      $filter: ModelTransactionFilterInput
      $limit: Int
      $nextToken: String
    ) {
      listTransactions(filter: $filter, limit: $limit, nextToken: $nextToken) {
        items {
          id
          title
          description
          amount
          currency
          method
          status
          paymentDate
          reference
          reference2
          createdAt
          updatedAt
        }
        nextToken
      }
    }
   `;
  
  const updateTransaction = gql`
    mutation updateTransaction($input: UpdateTransactionInput!) {
      updateTransaction(input: $input) {
        id
        status
        paymentDate
      }
    }
  `;

exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    const payload = JSON.parse(event.body);
    const referenceId = payload.billPaymentRef1;
    const transactionsData = await axios({
        url: process.env.API_MTELPAYMENT_GRAPHQLAPIENDPOINTOUTPUT,
        method: 'post',
        headers: {
            'x-api-key': process.env.API_MTELPAYMENT_GRAPHQLAPIKEYOUTPUT
        },
        data: {
          query: print(listTransactions),
          variables: {
            filter: {
              reference: {
                eq: referenceId
              }
            }
          }
        }
      });

    const result = transactionsData.data.data.listTransactions;
    if(result.items.length > 0){
      const itemId = result.items[0].id;
      
      const updatedTransaction = await axios({
        url: process.env.API_MTELPAYMENT_GRAPHQLAPIENDPOINTOUTPUT,
        method: 'post',
        headers: {
            'x-api-key': process.env.API_MTELPAYMENT_GRAPHQLAPIKEYOUTPUT
        },
        data: {
          query: print(updateTransaction),
          variables: {
              input: {
                id: itemId,
                status: "paid",
                paymentDate: new Date()
              }
            }
          }
        });
        
        const updatingResult = updatedTransaction.data.data.updateTransaction;
        return {
            statusCode: 200,
            body: JSON.stringify(updatingResult),
        };
    }
};

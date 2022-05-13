const gql = require('graphql-tag');

exports.listTransactions = gql`
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
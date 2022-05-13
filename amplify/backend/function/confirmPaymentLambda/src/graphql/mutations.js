const gql = require('graphql-tag');

exports.updateTransaction = gql`
  mutation updateTransaction($input: UpdateTransactionInput!) {
    updateTransaction(input: $input) {
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
  }
`;
const gql = require('graphql-tag');

exports.updateTransaction = gql`
  mutation updateTransaction($input: UpdateTransactionInput!) {
    updateTransaction(input: $input) {
      id
    }
  }
`;

// Use the following code to retrieve configured secrets from SSM:

const aws = require('aws-sdk');

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["OMISE_PUBLIC_KEY","OMISE_SECRET_KEY"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

// Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]

var omise = require('../index')({
  'publicKey': process.env.OMISE_PUBLIC_KEY,
  'secretKey': process.env.OMISE_SECRET_KEY,
});

exports.handler = async (event) => {
    // TODO implement
    const response = {
        statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  }, 
        body: JSON.stringify('Hello from Lambda!'),
    };

    var link = {
      'amount':      19000,
      'currency':    'thb',
      'multiple':    true,
      'title':       'Cappuccino',
      'description': 'Freshly brewed coffee',
    };
    
    omise.links.create(link, function(err, resp) {
      console.log(resp);
    });
    
    return response;
};

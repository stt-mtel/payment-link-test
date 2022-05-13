const aws = require("aws-sdk");

exports.getSecretValue = async (secret) => {
  const { Parameter } = await (new aws.SSM())
    .getParameter({"Name": process.env[secret], "WithDecryption": true})
    .promise();

  return Parameter.Value;
};

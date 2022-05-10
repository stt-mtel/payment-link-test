const aws = require("aws-sdk");

export const getSecretValue = async (secret) => {
  const { Parameter } = await new aws.SSM()
    .getParameter(process.env[secret], true)
    .promise();

  return Parameter.Value;
};

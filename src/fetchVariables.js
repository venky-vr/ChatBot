// process.env.AWS_SDK_LOAD_CONFIG = "1";
const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1",
  // accessKeyId: "cs-359536f4-eddb-5f23-b3e0-cdbd49c6536f",
  // secretAccessKey: "+QD7kvzQTJhBhN51bUjBE/p+aqRYR8eqkPTjoYCYrN8=",
});

const ssm = new AWS.SSM();

const fetchVariables = async () => {
  const params = {
    Names: [
      "/dev/SSI/config/spcltyprvdr/envVars/authApiCall",
      "/dev/SSI/config/spcltyprvdr/envVars/authGenerateJwtUrl",
      "/dev/SSI/config/spcltyprvdr/envVars/authGenerateTokenUrl",
      "/dev/SSI/config/spcltyprvdr/envVars/generateJwtUrl",
    ],
    WithDecryption: true, // Decrypt secure string parameters if applicable
  };

  try {
    const result = await ssm.getParameters(params).promise();
    const variables = result.Parameters.reduce((acc, param) => {
      const key = param.Name.split("/").pop(); // Extract variable name from the parameter name
      acc[key] = param.Value;
      return acc;
    }, {});

    console.log("Fetched Variables:", variables);
    return variables;
  } catch (error) {
    console.error("Error fetching variables:", error);
    throw error;
  }
};

// Example usage
module.exports = fetchVariables;

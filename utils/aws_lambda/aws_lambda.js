const { LambdaClient } = require('@aws-sdk/client-lambda');

const lambdaClient = new LambdaClient({
    region: process.env.AWS_REGION_,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID_,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_,
    },
});

module.exports = lambdaClient;
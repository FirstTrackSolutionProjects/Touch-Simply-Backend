const { InvokeCommand } = require("@aws-sdk/client-lambda");
const lambdaClient = require("./aws_lambda")
const decodeLambdaResponsePayload = require("./decodeLambdaResponse")

const invokeLambdaCommand = async (payload, FUNCTION_NAME) => {
    const command = new InvokeCommand({
        FunctionName: FUNCTION_NAME,
        InvocationType: "RequestResponse",
        Payload: JSON.stringify(payload),
    });

    const response = await lambdaClient.send(command);
    if (response.FunctionError) {
        const errBody = response.Payload;
        const message =
            (errBody && errBody.errorMessage) ||
            `Lambda function error: ${response.FunctionError}`;
        throw new Error(message);
    }
    return decodeLambdaResponsePayload(response.Payload);
}

module.exports = invokeLambdaCommand;
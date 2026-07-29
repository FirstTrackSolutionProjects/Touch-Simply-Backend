"use strict";
require('dotenv').config();

const invokeLambdaCommand = require("../../utils/aws_lambda/invokeLambdaCommand")

const FUNCTION_NAME =
    process.env.LATEX_PROCESSOR_LAMBDA_NAME;

async function latexProcessorService(WORKSPACE_KEY) {
    const payload = {
        "projectWorkspaceKey": WORKSPACE_KEY
    }
    const response = await invokeLambdaCommand(payload, FUNCTION_NAME);
    return response.body;
}

module.exports = latexProcessorService;

const decodeLambdaResponsePayload = (payload) => {
    return JSON.parse(Buffer.from(payload).toString("utf-8"));
}

module.exports = decodeLambdaResponsePayload;
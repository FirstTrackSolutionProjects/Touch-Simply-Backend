require('dotenv').config()

const { GetObjectTaggingCommand } = require("@aws-sdk/client-s3");

const { s3: s3Client } = require('../../utils/aws_s3')

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

const getS3Hash = async (key) => {
    try {
        const command = new GetObjectTaggingCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });

        const metadata = await s3Client.send(command);
        const tags = metadata.TagSet || [];
        const sha256Tag = tags.find((tag) => tag.Key === 'sha256') || {};
        // if (!sha256Tag) throw new Error("File does not have sha256 tag");
        return sha256Tag.Value || null;
    } catch (error) {
        console.error("Error fetching metadata:", error);
        throw error;
    }
}

module.exports = getS3Hash;
const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3 = new S3Client({
  region: process.env.AWS_REGION_,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_,
  },
});

const generateGetSignedUrl = async (filename) => {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: filename,
  });

  return getSignedUrl(s3, command, { expiresIn: 60 });
};

const generatePutSignedUrl = async (filename, filetype) => {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: filename,
    ContentType: filetype,
  });

  return getSignedUrl(s3, command, { expiresIn: 60 });
};

const uploadFileTos3 = async (fileBuffer, filetype, key) => {
  const url = await generatePutSignedUrl(key, filetype);

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': filetype,
    },
    body: fileBuffer,
  });

  if (!response.ok) {
    throw new Error(`S3 upload failed: ${response.status} ${response.statusText}`);
  }

  return response;
};

module.exports = {
  generateGetSignedUrl,
  generatePutSignedUrl,
  uploadFileTos3,
};
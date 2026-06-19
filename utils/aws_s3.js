require('dotenv').config();
const { S3Client, GetObjectCommand, PutObjectCommand, ListObjectsV2Command, CopyObjectCommand, paginateListObjectsV2, DeleteObjectsCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3 = new S3Client({
  region: process.env.AWS_REGION_,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_,
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

const generateGetSignedUrl = async (filename, expiresIn = 60) => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: filename,
  });

  return getSignedUrl(s3, command, { expiresIn });
};

const generatePutSignedUrl = async (filename, filetype) => {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
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

const copyDirectory = async (sourcePrefix, destinationPrefix) => {
  let continuationToken;

  do {
    const response = await s3.send(
      new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        Prefix: sourcePrefix,
        ContinuationToken: continuationToken,
      })
    );

    const objects = response.Contents || [];

    await Promise.all(
      objects.map(async (object) => {
        const sourceKey = object.Key;

        // Skip the "directory" marker if present
        if (sourceKey.endsWith("/")) return;

        const destinationKey = sourceKey.replace(
          sourcePrefix,
          destinationPrefix
        );

        await s3.send(
          new CopyObjectCommand({
            Bucket: BUCKET_NAME,
            CopySource: `${BUCKET_NAME}/${sourceKey}`,
            Key: destinationKey,
          })
        );

        console.log(`Copied ${sourceKey} -> ${destinationKey}`);
      })
    );

    continuationToken = response.NextContinuationToken;
  } while (continuationToken);
}

const listDirectory = async (prefix = "") => {
  const result = await s3.send(
    new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: prefix,
    })
  );

  const relativeFiles = result.Contents.map((object) => object.Key.replace(prefix, "")).filter((key) => key !== "");

  const fileTree = {};
  for (const file of relativeFiles) {
    const parts = file.split("/");
    let treePointer = fileTree;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i == parts.length - 1) {
        treePointer[part] = null;
        break;
      }
      if (!treePointer[part] && i != parts.length - 1) {
        treePointer[part] = {};
      }
      treePointer = treePointer[part];
    }
  }

  return fileTree;
}

const deleteDirectory = async (prefix) => {
    if (!prefix.endsWith('/')) {
        prefix += '/';
    }

    try {
        const paginator = paginateListObjectsV2(
            { client: s3, pageSize: 1000 }, 
            { Bucket: BUCKET_NAME, Prefix: prefix }
        );

        let totalDeleted = 0;

        for await (const page of paginator) {
            const objects = page.Contents;

            if (!objects || objects.length === 0) {
                continue;
            }

            const objectsToDelete = objects.map((obj) => ({ Key: obj.Key }));

            const deleteCommand = new DeleteObjectsCommand({
                Bucket: BUCKET_NAME,
                Delete: {
                    Objects: objectsToDelete,
                    Quiet: true
                }
            });

            await s3.send(deleteCommand);
            totalDeleted += objectsToDelete.length;
            console.log(`Successfully deleted a batch of ${objectsToDelete.length} objects...`);
        }

        console.log(`Finished deleting S3 directory : ${prefix}. Total objects deleted: ${totalDeleted}`);

    } catch (error) {
        console.error("❌ Error deleting S3 directory:", error);
        throw error;
    }
}


module.exports = {
  s3,
  generateGetSignedUrl,
  generatePutSignedUrl,
  uploadFileTos3,
  copyDirectory,
  listDirectory,
  deleteDirectory,
};
/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-extraneous-dependencies
import mime from 'mime';
import {
  ListObjectsCommand,
  S3Client,
  DeleteObjectsCommand,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from '@aws-sdk/client-cloudfront';

const {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_BUCKET_NAME,
} = process.env;

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export function getObjects() {
  const getCommand = new ListObjectsCommand({ Bucket: AWS_BUCKET_NAME });
  return s3Client.send(getCommand);
}

export async function getSingleObject(key) {
  const getCommand = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: key
  });

  try {
    const result = await s3Client.send(getCommand);

    if (result.Body) {
      return new Promise((resolve, reject) => {
        let data = '';
        result.Body.on('data', (chunk) => {
          data += chunk;
        });
        result.Body.on('end', () => {
          resolve(data);
        });
        result.Body.on('error', (err) => {
          reject(err);
        });
      });
    }
  } catch (error) {
    if (error.name === 'NoSuchKey') {
      return null;
    }
    throw error;
  }

  throw new Error("Failed to retrieve the object content.");
}

export function putObject(dirName, fileName, data) {
  const putCommand = new PutObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: dirName ? `${dirName}/${fileName}` : fileName,
    Body: data,
    ContentType: mime.getType(fileName),
  });
  return s3Client.send(putCommand);
}

export const putObjectFile = async (key, data) => {
  const mimeType = mime.getType(key) || 'application/octet-stream';

  const params = {
    Bucket: AWS_BUCKET_NAME,
    Key: key,
    Body: data,
    ContentType: mimeType
  };

  const putCommand = new PutObjectCommand(params);
  return s3Client.send(putCommand);
};

export function deleteObjects(contents) {
  const deleteCommand = new DeleteObjectsCommand({
    Bucket: AWS_BUCKET_NAME,
    Delete: { Objects: contents },
  });
  s3Client.send(deleteCommand);
}

export async function invalidateCloudFrontCache(tryCount, cloudFrontId) {
  const cloudfront = new CloudFrontClient({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
  });

  const command = new CreateInvalidationCommand({
    DistributionId: cloudFrontId,
    InvalidationBatch: {
      CallerReference: `${+new Date()}`,
      Paths: {
        Items: ['/*'],
        Quantity: 1,
      },
    },
  });

  try {
    await cloudfront.send(command);
  } catch (error) {
    if (tryCount > 0) {
      invalidateCloudFrontCache(tryCount - 1, cloudFrontId);
    } else {
      throw new Error(error);
    }
  }
}

export async function listObjectsWithPrefix(prefix) {
  const listCommand = new ListObjectsCommand({
    Bucket: AWS_BUCKET_NAME,
    Prefix: prefix
  });
  const { Contents } = await s3Client.send(listCommand);
  return Contents || [];
}

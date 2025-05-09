import AWS from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk';
import { createLogger } from '../utils/logger.mjs';

const logger = createLogger('attachmentUtils');
const XRayAWS = AWSXRay.captureAWS(AWS);
const s3 = new XRayAWS.S3({ 
  region: process.env.AWS_REGION,
  signatureVersion: 'v4'
});

const bucketName = process.env.ATTACHMENT_S3_BUCKET;
const signedUrlExpireSeconds = 300;

export async function generateUploadUrl(todoId) {
  logger.info(`Generating upload URL for todo ${todoId}`);
  
  try {
    const url = s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: todoId,
      Expires: signedUrlExpireSeconds,
      ContentType: 'image/*'

    });

    logger.info(`Generated URL for todo ${todoId}: ${url}`);
    return url;
  } catch (error) {
    logger.error(`Error generating upload URL: ${error.message}`, { error });
    throw new Error(`Error generating upload URL: ${error.message}`);
  }
}

export function getAttachmentUrl(todoId) {
  return `https://${bucketName}.s3.amazonaws.com/${todoId}`;
}
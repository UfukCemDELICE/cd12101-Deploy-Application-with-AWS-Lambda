import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({ region: process.env.AWS_REGION })

const bucketName = process.env.ATTACHMENT_S3_BUCKET
const signedUrlExpireSeconds = 300  

export async function generateUploadUrl(todoId) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: todoId,
    ContentType: 'image/*'  
  })

  const url = await getSignedUrl(s3Client, command, {
    expiresIn: signedUrlExpireSeconds
  })

  return url
}

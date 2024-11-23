import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { todosService } from "../../businessLogic/todosService.mjs";

const s3Client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_TEST,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_TEST
  }
});

export async function handler(event) {
  const todoId = event.pathParameters.todoId

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: todoId
  });
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: 60 * 60 // 1 hour
  })
  const attachmentUrl = url.split('?')[0];
  await todosService.updateTodo(todoId, { attachmentUrl: attachmentUrl, done: true });
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: url
    })
  }
}


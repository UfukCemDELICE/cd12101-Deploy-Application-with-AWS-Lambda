import middy from '@middy/core';
import httpCors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { generateUploadUrl } from '../../businessLogic/todos.mjs';
import { createLogger } from '../../utils/logger.mjs';
import { getUserId } from '../utils.mjs';

const logger = createLogger('generateUploadUrl');

const generateUploadUrlHandler = async (event) => {
  const todoId = event.pathParameters.todoId;
  const userId = getUserId(event);
  logger.info('GenerateUploadUrlHandler input:', { todoId, userId });

  const uploadUrl = await generateUploadUrl(todoId, userId);

  return {
    statusCode: 200,
    body: JSON.stringify({ uploadUrl })
  };
};

export const handler = middy(generateUploadUrlHandler)
  .use(httpErrorHandler())
  .use(httpCors());
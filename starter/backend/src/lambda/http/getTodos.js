import middy from '@middy/core';
import httpCors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { getTodosForUser } from '../../businessLogic/todos.mjs';
import { createLogger } from '../../utils/logger.mjs';
import { getUserId } from '../utils.mjs';

const logger = createLogger('getTodos');

const getTodosHandler = async (event) => {
  const userId = getUserId(event);
  logger.info('GetTodosHandler input:', { userId });

  const todos = await getTodosForUser(userId);

  return {
    statusCode: 200,
    body: JSON.stringify({ items: todos })
  };
};

export const handler = middy(getTodosHandler)
  .use(httpErrorHandler())
  .use(httpCors());
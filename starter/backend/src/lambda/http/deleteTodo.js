import middy from '@middy/core';
import httpCors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { deleteTodo } from '../../businessLogic/todos.mjs';
import { createLogger } from '../../utils/logger.mjs';
import { getUserId } from '../utils.mjs';

const logger = createLogger('deleteTodo');

const deleteTodoHandler = async (event) => {
  const todoId = event.pathParameters.todoId;
  const userId = getUserId(event);
  logger.info('DeleteTodoHandler input:', { todoId, userId });

  await deleteTodo(todoId, userId);

  return {
    statusCode: 204,
    body: ''
  };
};

export const handler = middy(deleteTodoHandler)
  .use(httpErrorHandler())
  .use(httpCors());
import middy from '@middy/core';
import httpCors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { updateTodo } from '../../businessLogic/todos.mjs';
import { createLogger } from '../../utils/logger.mjs';
import { getUserId } from '../utils.mjs';

const logger = createLogger('updateTodo');

const updateTodoHandler = async (event) => {
  const todoId = event.pathParameters.todoId;
  const userId = getUserId(event);
  const updatedTodo = event.body;
  logger.info('UpdateTodoHandler input:', { todoId, userId, updatedTodo });

  await updateTodo(todoId, userId, updatedTodo);

  return {
    statusCode: 204,
    body: null
  };
};

export const handler = middy(updateTodoHandler)
  .use(httpJsonBodyParser())
  .use(httpErrorHandler())
  .use(httpCors());
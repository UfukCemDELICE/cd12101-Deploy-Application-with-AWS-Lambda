import middy from '@middy/core';
import httpCors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { createTodo } from '../../businessLogic/todos.mjs';
import { createLogger } from '../../utils/logger.mjs';
import { getUserId } from '../utils.mjs';

const logger = createLogger('createTodo');

const createTodoHandler = async (event) => {
  logger.info('CreateTodoHandler input:', { body: event.body });
  const newTodo = event.body;
  const userId = getUserId(event);

  if (!newTodo) {
    logger.error('Missing request body');
    throw new Error('Request body is missing');
  }

  const name = newTodo.name ? String(newTodo.name).trim() : null;
  const dueDate = newTodo.dueDate ? String(newTodo.dueDate).trim() : null;

  if (!name) {
    logger.error('Missing or empty name in request', { newTodo });
    throw new Error('Todo name is missing or empty');
  }
  if (!dueDate) {
    logger.error('Missing or empty dueDate in request', { newTodo });
    throw new Error('Todo dueDate is missing or empty');
  }

  const createdTodo = await createTodo(newTodo, userId);

  return {
    statusCode: 201,
    body: JSON.stringify({ item: createdTodo })
  };
}

export const handler = middy(createTodoHandler)
  .use(httpJsonBodyParser())
  .use(httpErrorHandler())
  .use(httpCors());
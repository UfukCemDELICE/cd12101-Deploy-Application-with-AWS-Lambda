import { TodosAccess } from '../dataLayer/todosAccess.mjs'
import { createLogger } from '../utils/logger.mjs'
import { generateUploadUrl as generateUploadUrlFileStorage } from '../fileStorage/attachmentUtils.mjs'

const todosAccess = new TodosAccess()
const logger = createLogger('todos')
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const bucketName = process.env.ATTACHMENT_S3_BUCKET

function validateTodoId(todoId) {
  if (!todoId || typeof todoId !== 'string' || !todoId.match(uuidRegex)) {
    logger.error('Invalid todoId', { todoId })
    throw new Error(`Invalid todoId: ${todoId}. Must be a valid UUID`)
  }
}

export async function getTodosForUser(userId) {
  logger.info(`Fetching todos for user: ${userId}`)
  return await todosAccess.getTodos(userId)
}

export async function createTodo(todoItem, userId) {
  logger.info('Creating new todo item', { todoItem, userId })
  if (!todoItem) {
    logger.error('Missing todoItem')
    throw new Error('Todo item is missing')
  }
  const name = todoItem.name ? String(todoItem.name).trim() : null
  const dueDate = todoItem.dueDate ? String(todoItem.dueDate).trim() : null
  if (!name) {
    logger.error('Missing or empty name', { todoItem })
    throw new Error('Todo name is missing or empty')
  }
  if (!dueDate) {
    logger.error('Missing or empty dueDate', { todoItem })
    throw new Error('Todo dueDate is missing or empty')
  }
  const sanitizedTodo = {
    name,
    dueDate,
    done: todoItem.done ?? false
  }
  return await todosAccess.createTodo(sanitizedTodo, userId)
}

export async function updateTodo(todoId, userId, updatedTodoData) {
  logger.info(`Updating todo item with id: ${todoId} for user: ${userId}`, { updatedTodoData })
  validateTodoId(todoId)
  const existingTodo = await todosAccess.getTodoById(todoId, userId)
  if (!existingTodo) {
    logger.error('Todo item not found', { todoId, userId })
    throw new Error(`Todo item with ID ${todoId} not found`)
  }
  if (existingTodo.userId !== userId) {
    logger.error('Todo item not owned by user', { todoId, userId })
    throw new Error(`Todo item with ID ${todoId} not owned by user ${userId}`)
  }
  return await todosAccess.updateTodo(todoId, userId, updatedTodoData)
}

export async function deleteTodo(todoId, userId) {
  logger.info(`Deleting todo item with id: ${todoId} for user: ${userId}`)
  validateTodoId(todoId)
  const existingTodo = await todosAccess.getTodoById(todoId, userId)
  if (!existingTodo) {
    logger.error('Todo item not found', { todoId, userId })
    throw new Error(`Todo item with ID ${todoId} not found`)
  }
  if (existingTodo.userId !== userId) {
    logger.error('Todo item not owned by user', { todoId, userId })
    throw new Error(`Todo item with ID ${todoId} not owned by user ${userId}`)
  }
  return await todosAccess.deleteTodo(todoId, userId)
}

export async function generateUploadUrl(todoId, userId) {
  logger.info(`Generating upload URL for todo item with id: ${todoId} for user: ${userId}`)
  validateTodoId(todoId)
  const existingTodo = await todosAccess.getTodoById(todoId, userId)
  if (!existingTodo) {
    logger.error('Todo item not found', { todoId, userId })
    throw new Error(`Todo item with ID ${todoId} not found`)
  }
  if (existingTodo.userId !== userId) {
    logger.error('Todo item not owned by user', { todoId, userId })
    throw new Error(`Todo item with ID ${todoId} not owned by user ${userId}`)
  }
  const signedUrl = await generateUploadUrlFileStorage(todoId)
  const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`
  await todosAccess.updateTodo(todoId, userId, { attachmentUrl })
  return signedUrl
}
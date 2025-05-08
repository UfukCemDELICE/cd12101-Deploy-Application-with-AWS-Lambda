import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  QueryCommand,
  PutCommand,
  UpdateCommand,
  GetCommand,
  DeleteCommand
} from '@aws-sdk/lib-dynamodb';
import { createLogger } from '../utils/logger.mjs';
import { v4 as uuidv4 } from 'uuid';

const logger = createLogger('todosAccess');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export class TodosAccess {
  constructor() {
    this.docClient = docClient;
    this.todosTable = process.env.TODOS_TABLE;
  }

  async getTodos(userId) {
    logger.info('Getting all todos for user', { userId });

    const result = await this.docClient.send(
      new QueryCommand({
        TableName: this.todosTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
    );

    return result.Items;
  }

  async createTodo(todoItem, userId) {
    logger.info('Storing new todo item', { todoItem, userId });

    const todoId = uuidv4();
    const item = {
      userId,
      todoId,
      ...todoItem,
      createdAt: new Date().toISOString(),
      done: todoItem.done ?? false
    };

    await this.docClient.send(
      new PutCommand({
        TableName: this.todosTable,
        Item: item
      })
    );

    return item;
  }

  async updateTodo(todoId, userId, updatedTodoData) {
    logger.info(`Updating todo in database with id: ${todoId}`, {
      updatedTodoData
    });

    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    if (updatedTodoData.name !== undefined) {
      updateExpressions.push('#name = :name');
      expressionAttributeNames['#name'] = 'name';
      expressionAttributeValues[':name'] = updatedTodoData.name;
    }
    if (updatedTodoData.dueDate !== undefined) {
      updateExpressions.push('#dueDate = :dueDate');
      expressionAttributeNames['#dueDate'] = 'dueDate';
      expressionAttributeValues[':dueDate'] = updatedTodoData.dueDate;
    }
    if (updatedTodoData.done !== undefined) {
      updateExpressions.push('#done = :done');
      expressionAttributeNames['#done'] = 'done';
      expressionAttributeValues[':done'] = updatedTodoData.done;
    }
    if (updatedTodoData.attachmentUrl !== undefined) {
      updateExpressions.push('#attachmentUrl = :attachmentUrl');
      expressionAttributeNames['#attachmentUrl'] = 'attachmentUrl';
      expressionAttributeValues[':attachmentUrl'] = updatedTodoData.attachmentUrl;
    }

    if (updateExpressions.length === 0) {
      logger.info('No fields to update', { todoId, userId });
      return {};
    }

    const result = await this.docClient.send(
      new UpdateCommand({
        TableName: this.todosTable,
        Key: {
          userId,
          todoId
        },
        UpdateExpression: 'set ' + updateExpressions.join(', '),
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
      })
    );

    return result.Attributes;
  }

  async getTodoById(todoId, userId) {
    logger.info(`Fetching todo with id: ${todoId} for user: ${userId}`);

    const result = await this.docClient.send(
      new GetCommand({
        TableName: this.todosTable,
        Key: { userId, todoId }
      })
    );

    return result.Item;
  }

  async deleteTodo(todoId, userId) {
    logger.info(`Deleting todo from database with id: ${todoId}`);

    await this.docClient.send(
      new DeleteCommand({
        TableName: this.todosTable,
        Key: {
          userId,
          todoId
        }
      })
    );
  }
}

export const todosAccess = new TodosAccess();
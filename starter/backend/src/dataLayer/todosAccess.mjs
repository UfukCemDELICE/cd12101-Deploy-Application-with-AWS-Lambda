import { createLogger } from '../utils/logger.mjs';
import { v4 as uuidv4 } from 'uuid';
import AWSXRay from 'aws-xray-sdk';
import AWS from 'aws-sdk';

const XRayAWS = AWSXRay.captureAWS(AWS);
const logger = createLogger('todosAccess');

export class TodosAccess {
  constructor() {
    this.dynamoDb = new XRayAWS.DynamoDB.DocumentClient();
    this.todosTable = process.env.TODOS_TABLE;
  }

  async getTodos(userId) {
    logger.info('Getting all todos for user', { userId });

    const result = await this.dynamoDb.query({
      TableName: this.todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise();

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

    await this.dynamoDb.put({
      TableName: this.todosTable,
      Item: item
    }).promise();

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

    const result = await this.dynamoDb.update({
      TableName: this.todosTable,
      Key: {
        userId,
        todoId
      },
      UpdateExpression: 'set ' + updateExpressions.join(', '),
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    }).promise();

    return result.Attributes;
  }

  async getTodoById(todoId, userId) {
    logger.info(`Fetching todo with id: ${todoId} for user: ${userId}`);

    const result = await this.dynamoDb.get({
      TableName: this.todosTable,
      Key: { userId, todoId }
    }).promise();

    return result.Item;
  }

  async deleteTodo(todoId, userId) {
    logger.info(`Deleting todo from database with id: ${todoId}`);

    await this.dynamoDb.delete({
      TableName: this.todosTable,
      Key: {
        userId,
        todoId
      }
    }).promise();
  }
}

export const todosAccess = new TodosAccess();
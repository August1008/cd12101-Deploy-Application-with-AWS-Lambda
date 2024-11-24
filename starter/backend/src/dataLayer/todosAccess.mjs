import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'
import 'dotenv/config';
import { createLogger } from '../utils/logger.mjs';
import AWSXRay from 'aws-xray-sdk-core';


const logger = createLogger('database')

const dynamoDB = new DynamoDB({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_TEST,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_TEST
    }
});

const dynamoDbXRay = AWSXRay.captureAWSv3Client(dynamoDB)


const dynamodbClient = DynamoDBDocument.from(dynamoDbXRay);

const todosTable = process.env.TODOS_TABLE;
const TodoIdIndex = process.env.TODOS_TODOID_INDEX
const CreatedAtIndex = process.env.CreatedAtIndex;

const todosAccess = (function todosAccess() {
    return {
        async getTodos(userId) {
            const result = await dynamodbClient.query(
                {
                    TableName: todosTable,
                    KeyConditionExpression: "userId = :userId",
                    ExpressionAttributeValues: {
                        ':userId': userId
                    }
                }
            )
            logger.info(`query result: ${JSON.stringify(result)}`);
            const items = result.Items;
            return items;
        },
        async createTodo(userId, item) {
            const itemId = uuidv4();
            const createdAt = new Date().toString();
            const newItem = {
                todoId: itemId,
                userId: userId,
                createdAt: createdAt,
                done: false,
                ...item
            };
            const result = await dynamodbClient.put({
                TableName: todosTable,
                Item: newItem
            });
            logger.info(`query result: ${JSON.stringify(result)}`);
            return newItem;
        },
        async deleteTodo(todoId) {
            const todos = await dynamodbClient.query({
                TableName: todosTable,
                IndexName: TodoIdIndex,
                KeyConditionExpression: "todoId = :todoId",
                ExpressionAttributeValues: {
                    ':todoId': todoId
                }
            });
            if (todos.Count > 0) {
                const result = await dynamodbClient.delete({
                    TableName: todosTable,
                    Key: {
                        todoId: todoId,
                        userId: todos.Items[0].userId
                    }
                });
                logger.info(`query result: ${JSON.stringify(result)}`);
                return todoId;
            }
            else return null;
        },
        async updateTodo(todoId, updatedTodo) {
            const todos = await dynamodbClient.query({
                TableName: todosTable,
                IndexName: TodoIdIndex,
                KeyConditionExpression: "todoId = :todoId",
                ExpressionAttributeValues: {
                    ':todoId': todoId
                }
            });
            
            if (todos.Count > 0) {
                const updatedItem = { ...todos.Items[0], ...updatedTodo };
                const result = await dynamodbClient.put({
                    TableName: todosTable,
                    Item: updatedItem
                });
                logger.info(`query result: ${JSON.stringify(result)}`);
                return updatedItem;
            }
            return null;
        }
    }
})()

export { todosAccess };

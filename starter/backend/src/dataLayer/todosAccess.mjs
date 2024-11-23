import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'
import 'dotenv/config';


const dynamoDB = new DynamoDB({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_TEST,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_TEST
    }
});


const dynamodbClient = DynamoDBDocument.from(dynamoDB);

const todosTable = process.env.TODOS_TABLE;
const TodoIdIndex = process.env.TODOS_TODOID_INDEX
const CreatedAtIndex = process.env.CreatedAtIndex;

const todosAccess = (function todosAccess() {
    return {
        async getTodos() {
            const result = await dynamodbClient.scan(
                {
                    TableName: todosTable,
                }
            )
            const items = result.Items;
            return items;
        },
        async createTodo(item) {
            const itemId = uuidv4();
            const newItem = {
                todoId: itemId,
                ...item
            };
            const result = await dynamodbClient.put({
                TableName: todosTable,
                Item: newItem
            });
            console.log(result);
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
                return updatedItem;
            }
            return null;
        }
    }
})()

export { todosAccess };

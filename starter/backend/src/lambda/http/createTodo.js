import { todosService } from "../../businessLogic/todosService.mjs";
import { getUserId } from "../utils.mjs";

export async function handler(event) {
  const newTodo = JSON.parse(event.body);
  if (newTodo.name === undefined || newTodo.name.length === 0) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ message: "Name is required" })
    };
  }
  const userId = getUserId(event);
  const result = await todosService.createTodo(userId, newTodo);
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: result
    })
  }
}


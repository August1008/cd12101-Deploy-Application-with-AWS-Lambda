import { todosService } from "../../businessLogic/todosService.mjs";
import { getUserId } from "../utils.mjs";

export async function handler(event) {
  const userId = getUserId(event);
  const items = await todosService.getTodos(userId);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({items})
  };
}

import { todosService } from "../../businessLogic/todosService.mjs";

export async function handler(event) {
  const items = await todosService.getTodos();
  return {
    statusCode: 200,
    body: JSON.stringify({items})
  };
}

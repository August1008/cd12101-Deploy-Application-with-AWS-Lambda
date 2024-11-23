import { todosService } from "../../businessLogic/todosService.mjs";

export async function handler(event) {
  const todoId = event.pathParameters.todoId

  const result = await todosService.deleteTodo(todoId);
  return {
    statusCode: 204
  };
}


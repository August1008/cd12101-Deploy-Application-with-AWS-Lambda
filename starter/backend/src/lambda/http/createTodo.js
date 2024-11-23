import { todosService } from "../../businessLogic/todosService.mjs";

export async function handler(event) {
  const newTodo = JSON.parse(event.body)

  const result = await todosService.createTodo(newTodo);
  return {
    statusCode: 201,
    body: JSON.stringify({
      result
    })
  }
}


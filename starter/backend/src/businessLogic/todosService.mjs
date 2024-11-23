import { todosAccess } from "../dataLayer/todosAccess.mjs";

const todosService = (function todosService(){
    return {
        async getTodos(userId) {
            return todosAccess.getTodos(userId);
        },
        async createTodo(userId, item) {
            return todosAccess.createTodo(userId, item);
        },
        async deleteTodo(todoId) {
            return todosAccess.deleteTodo(todoId);
        },
        async updateTodo(todoId, updatedTodo) {
            return todosAccess.updateTodo(todoId, updatedTodo);
        }
    };
})()


export {todosService};
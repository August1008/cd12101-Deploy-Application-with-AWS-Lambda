import { todosAccess } from "../dataLayer/todosAccess.mjs";

const todosService = (function todosService(){
    return {
        async getTodos() {
            return todosAccess.getTodos();
        },
        async createTodo(item) {
            return todosAccess.createTodo(item);
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
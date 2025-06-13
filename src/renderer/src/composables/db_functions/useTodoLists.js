/**
 * TODO LISTS RELATED COMPOSABLE
 * --------------------------------------------------------------------------------------------------------------
 * @function addTodoList {function} - Adds a todo list to the database
 * @function editTodoList {function} - Edits a todo list in the database
 * @function onTodoListsUpdate {function} - Listens for todo list updates from the database
 */

export function useTodoLists() {
    const addTodoList = async (todoList) => {
        return await window.api.addTodoList(todoList)
    }

    const editTodoList = async (todoList) => {
        return await window.api.editTodoList(todoList)
    }

    const onTodoListsUpdate = (callback) => {
        return window.api.onTodoListsUpdate(callback)
    }

    return {
        addTodoList,
        editTodoList,
        onTodoListsUpdate
    }
}
/**
 * IDEAS RELATED COMPOSABLE
 * --------------------------------------------------------------------------------------------------------------
 * @function addIdea {function} - Adds a new idea to the database
 * @function updateIdea {function} - Updates an existing idea in the database
 * @function onIdeasUpdate {function} - Listens for ideas updates from the database
 */
export function useIdeas() {
    const addIdea = async (idea) => {
        return await window.api.addIdea(idea)
    }

    const editIdea = async (idea) => {
        return await window.api.editIdea(idea)
    }

    const onIdeasUpdate = (callback) => {
        return window.api.onIdeasUpdate(callback)
    }

    return {
        addIdea,
        editIdea,
        onIdeasUpdate
    }
}
/**
 * PROJECTS RELATED COMPOSABLE
 * --------------------------------------------------------------------------------------------------------------
 * @function !addProject !! NOT IMPLEMENTED - Projects addable via idea-to-project-conversion (Ideas.vue)
 * @function editProject {function} - Edits a project in the database
 * @function onProjectsUpdate {function} - Listens for project updates from the database
 */

export function useProjects() {
    const editProject = async (project) => {
        return await window.api.editProject(project)
    }

    const onProjectsUpdate = (callback) => {
        return window.api.onProjectsUpdate(callback)
    }

    return {
        editProject,
        onProjectsUpdate
    }
}
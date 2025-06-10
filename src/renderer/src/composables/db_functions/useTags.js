/**
 * TAGS RELATED COMPOSABLE
 * --------------------------------------------------------------------------------------------------------------
 * @function addTag {function} - Adds a new tag to the database
 * @function editTag {function} - Edits an existing tag in the database
 * @function onTagsUpdate {function} - Listens for tags updates from the database
 */
export function useTags() {
  const addTag = async (tag) => {
    return await window.api.addTag(tag)
  }

  const editTag = async (tag) => {
    return await window.api.editTag(tag)
  }

  const onTagsUpdate = (callback) => {
    return window.api.onTagsUpdate(callback)
  }

  return {
    addTag,
    editTag,
    onTagsUpdate
  }
}


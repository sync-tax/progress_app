// ========== COMPOABLE PROVIDING DATABASE FUNCTIONS FOR IDEAS ========== 
import { ref } from 'vue'

export function useIdeas() {
    const ideas = ref([])
    const ideaData = ref({
        title: '',
        description: '',
        rank: 'common',
    })
    
    const getIdeas = async () => {
        ideas.value = await window.api.getIdeas()
    }

    const addIdea = async (idea) => {
        return await window.api.addIdea(idea)
    }

    const updateIdea = async (idea) => {
        return await window.api.updateIdea(idea)
    }

    const deleteIdea = async (id) => {
        return await window.api.deleteIdea(id)
    }

    const onIdeasUpdate = (callback) => {
        return window.api.onIdeasUpdate(callback)
    }

    return {
        ideas,
        ideaData,
        getIdeas,
        addIdea,
        updateIdea,
        deleteIdea,
        onIdeasUpdate
    }
}
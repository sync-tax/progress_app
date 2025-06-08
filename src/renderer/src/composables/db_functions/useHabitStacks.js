// ========== COMPOABLE PROVIDING DATABASE FUNCTIONS FOR HABIT STACKS ========== 
import { ref } from 'vue'

export function useHabitStacks() {
    const habitStacks = ref([])
    const habitStackData = ref({
        title: '',
        position: 0
    })
    
    const fetchHabitStacks = async () => {
        habitStacks.value = await window.api.getHabitStacks()
    }

    const addHabitStack = async (habitStack) => {
        return await window.api.addHabitStack(habitStack)
    }

    const updateHabitStack = async (habitStack) => {
        return await window.api.updateHabitStack(habitStack)
    }

    const deleteHabitStack = async (id) => {
        return await window.api.deleteHabitStack(id)
    }

    return {
        habitStacks,
        habitStackData,
        fetchHabitStacks,
        addHabitStack,
        updateHabitStack,
        deleteHabitStack
    }
}
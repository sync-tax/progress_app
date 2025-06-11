// ========== COMPOABLE PROVIDING DATABASE FUNCTIONS FOR HABIT STACKS ========== 
import { ref } from 'vue'

export function useHabitStacks() {
    const addHabitStack = async (habitStack) => {
        return await window.api.addHabitStack(habitStack)
    }

    const editHabitStack = async (habitStack) => {
        return await window.api.editHabitStack(habitStack)
    }

    const onHabitStacksUpdate = (callback) => {
        return window.api.onHabitStacksUpdate(callback)
    }

    return {
        addHabitStack,
        editHabitStack,
        onHabitStacksUpdate
    }
}
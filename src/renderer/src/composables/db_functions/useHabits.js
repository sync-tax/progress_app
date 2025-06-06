import { ref } from 'vue'

export function useHabits() {
    const habits = ref([])
    const habitData = ref({
        title: '',
        counter: 0,
        current_streak: 0,
        best_streak: 0,
        tag_name: ''
    })
    
    const fetchHabits = async () => {
        habits.value = await window.api.getHabits()
    }

    const addHabit = async (habit) => {
        return await window.api.addHabit(habit)
    }

    const updateHabit = async (habit) => {
        return await window.api.updateHabit(habit)
    }

    const deleteHabit = async (id) => {
        return await window.api.deleteHabit(id)
    }

    return {
        habits,
        habitData,
        fetchHabits,
        addHabit,
        updateHabit,
        deleteHabit
    }
}
import { ref } from 'vue'
import { getStartOfDay } from '../helpers/useDates'

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
        habits.value = await window.api.getHabits();
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

    const updateStreaks = async () => {
        if (!habits.value || habits.value.length === 0) {
            return false // No habits to check yet
        }

        const todayStart = getStartOfDay(new Date())
        const yesterdayStart = getStartOfDay(new Date(todayStart.getTime() - 24 * 60 * 60 * 1000))
        let habitsUpdated = false

        //iterate over habits.value array
        for (const habit of habits.value) { 
            if (habit.current_streak > 0) {
                const lastCompleted = getStartOfDay(habit.last_time_completed)
                let resetStreak = false

                if (lastCompleted) {
                    const isToday = lastCompleted.getTime() === todayStart.getTime()
                    const wasYesterday = lastCompleted.getTime() === yesterdayStart.getTime()
                    if (!isToday && !wasYesterday) {
                        resetStreak = true
                    }
                } else {
                    resetStreak = true // has a streak but no valid last_time_completed
                }

                if (resetStreak) {
                    if (habit.current_streak > habit.best_streak) habit.best_streak = habit.current_streak
                    const updatedHabitData = { ...habit, current_streak: 0 }
                    await window.api.updateHabit(updatedHabitData)
                    habitsUpdated = true
                }
            }
        }
        return habitsUpdated
    }

    return {
        habits,
        habitData,
        fetchHabits,
        addHabit,
        updateHabit,
        deleteHabit,
        updateStreaks
    }
}
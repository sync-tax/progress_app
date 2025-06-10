// ========== COMPOABLE PROVIDING DATABASE FUNCTIONS FOR HABITS ========== 
import { ref } from 'vue'
import { useToasts } from '../ui/useToasts'

const { addToast } = useToasts()

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

    const toggleHabitCompletion = async (habitId) => {
        try {
            const result = await window.api.toggleHabitCompletion(habitId)
            if (result && result.success && result.habit) {
                const index = habits.value.findIndex(h => h.id === habitId)
                if (index !== -1) {
                    // Update only the fields managed by this backend call
                    habits.value[index].counter = result.habit.counter;
                    habits.value[index].current_streak = result.habit.current_streak;
                    habits.value[index].best_streak = result.habit.best_streak;
                    habits.value[index].last_time_completed = result.habit.last_time_completed;
                }
                return { success: true, habit: result.habit };
            } else {
                console.error('Failed to toggle habit completion:', result?.error);
                return { success: false, error: result?.error || 'Unknown error toggling habit.' };
            }
        } catch (error) {
            console.error('Error in toggleHabitCompletionOnBackend:', error);
            return { success: false, error: 'Exception occurred while toggling habit.' };
        }
    }

    const runDailyStreakUpdate = async () => {
        try {
            const result = await window.api.updateAllStreaks();
            if (result && result.success) {
                if (result.updatedCount > 0) {
                    addToast({ message: `You lost ${result.updatedCount} streaks!`, type: 'warning' });
                    await fetchHabits(); // Refresh the list if any streaks were reset
                }
                if (result.errors && result.errors.length > 0) {
                    addToast({ message: `Errors during daily streak update: ${result.errors}`, type: 'error' });
                }
                return result;
            } else {
                addToast({ message: 'Daily streak update failed or did not run successfully.', type: 'error' });
                return { success: false, message: 'Daily streak update failed.', errors: result?.errors };
            }
        } catch (error) {
            console.error('Error running daily streak update on backend:', error);
            return { success: false, message: 'Exception occurred during daily streak update.' };
        }
    };

    // Listener for HABITS_UPDATED event from main process
    // This helps keep data in sync if backend changes habits outside direct user action
    // (e.g. after daily streak update from another window or on app start)
    const onHabitsUpdate = (callback) => {
        return window.api.onHabitsUpdate(callback)
    }

    return {
        habits,
        habitData,
        fetchHabits,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabitCompletion,
        runDailyStreakUpdate,
        onHabitsUpdate
    }
}
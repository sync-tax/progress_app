/**
 * RANKS HELPER
 * --------------------------------------------------------------------------------------------------------------
 * @function getTagRank {function} - Gets tag rank based on level
 * @function getHabitRank {function} - Gets habit rank based on streak and counter
 */
export const useRanks = () => {
    const getTagRank = (tag) => {
        if (tag.level >= 55) return 'legendary';
        else if (tag.level >= 40) return 'epic';
        else if (tag.level >= 25) return 'rare';
        else if (tag.level >= 10) return 'uncommon';
        else return 'common';
    }

    const getHabitRank = (habit) => {
        const score = habit.best_streak * habit.counter;
        if (score >= 2000) return 'legendary';
        else if (score >= 1000) return 'epic';
        else if (score >= 500) return 'rare';
        else if (score >= 100) return 'uncommon';
        else return 'common';
    }

    return {
        getTagRank,
        getHabitRank
    }
}
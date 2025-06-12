import { useRanks } from "./useRanks";
const { getHabitRank } = useRanks()
import { useConstants } from "./useConstants";
const { EXP_MULTIPLIER_USER, EXP_MULTIPLIER_TAGS } = useConstants()

/**
 * PROGRESSIONS HELPER
 * --------------------------------------------------------------------------------------------------------------
 * @function getHabitProgressionReward {function} - Gets habit progression reward based on habit rank
 */
export const useProgressions = () => {

    const getHabitProgressionReward = (habit) => {
        const habitRank = getHabitRank(habit)

        switch (habitRank) {
            case 'common':
                return {
                    exp: 10,
                    crystals: 1
                }
            case 'uncommon':
                return {
                    exp: 20,
                    crystals: 2
                }
            case 'rare':
                return {
                    exp: 30,
                    crystals: 3
                }
            case 'epic':
                return {
                    exp: 40,
                    crystals: 4
                }
            case 'legendary':
                return {
                    exp: 50,
                    crystals: 5
                }
        }
    }

    function updateLevel(levelObj, expChange, isUser) {
        let newExp = levelObj.exp_current + expChange;
        let newLevel = levelObj.level;
        
        // Handle leveling up
        while (newExp >= levelObj.exp_needed) {
          newExp -= levelObj.exp_needed;
          newLevel++;
          levelObj.exp_needed = isUser ? EXP_MULTIPLIER_USER(newLevel) : EXP_MULTIPLIER_TAGS(newLevel);
        }
        
        // Handle leveling down (for undoing)
        while (newExp < 0 && newLevel > 1) {
          newLevel--;
          const prevExpNeeded = isUser ? EXP_MULTIPLIER_USER(newLevel) : EXP_MULTIPLIER_TAGS(newLevel);
          newExp += prevExpNeeded;
          levelObj.exp_needed = prevExpNeeded;
        }
        
        levelObj.level = newLevel;
        levelObj.exp_current = Math.max(0, newExp); // Ensure exp doesn't go below 0
      }

    return {
        getHabitProgressionReward,
        updateLevel
    }
}
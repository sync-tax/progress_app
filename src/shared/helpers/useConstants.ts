/**
 * CONSTANTS HELPER
 * --------------------------------------------------------------------------------------------------------------
 * @var LEVEL_CAP {number} - Maximum level cap
 * @function EXP_MULTIPLIER_USER {function} - Calculates experience multiplier based on user level
 * @function EXP_MULTIPLIER_TAGS {function} - Calculates experience multiplier based on tag level
 * @var MAX_TIMER_DURATION {number} - Maximum timer duration
 * @var MIN_TIMER_DURATION {number} - Minimum timer duration
 */
export function useConstants() {
    const LEVEL_CAP = 60

    const EXP_MULTIPLIER_USER = (level: number) => {
        return Math.round(60 * 1.13 ** level)
    }
    const EXP_MULTIPLIER_TAGS = (level: number) => {
        return Math.round(60 * 1.1 ** level)
    }

    const MAX_TIMER_DURATION = 120
    const MIN_TIMER_DURATION = 1

    return {
        LEVEL_CAP,
        EXP_MULTIPLIER_USER,
        EXP_MULTIPLIER_TAGS,
        MAX_TIMER_DURATION,
        MIN_TIMER_DURATION
    }
}



import { useToasts } from '../ui/useToasts'
const { addToast } = useToasts()

/**
 * REWARDS RELATED COMPOSABLE
 * --------------------------------------------------------------------------------------------------------------
 * @function addReward {function} - Adds a new reward to the database
 * @function editReward {function} - Edits an existing reward in the database
 * @function onRewardsUpdate {function} - Listens for rewards updates from the database
 * @function unlockReward {function} - Unlocks a reward and updates the balance
 */
export function useRewards() {
    const addReward = async (reward) => {
        return await window.api.addReward(reward)
    }

    const editReward = async (reward) => {
        return await window.api.editReward(reward)
    }

    const onRewardsUpdate = (callback) => {
        return window.api.onRewardsUpdate(callback)
    }
    
    const unlockReward = async (reward) => {
        try {
            const result = await window.api.unlockReward(reward); 
            if (result.success) {
              addToast({message: '-' + result.rewardCost + ' Crystals', type: 'minusCrystals'})
              addToast({ message: result.message, type: 'success' })
            } else {
              addToast({ message: result.message, type: 'error' })
            }
          } catch (error) {
            console.error('Error unlocking reward:', error)
            addToast({ message: 'An error occured...', type: 'error' })
          }
    }

    return {
        addReward,
        editReward,
        unlockReward,
        onRewardsUpdate
    }
}
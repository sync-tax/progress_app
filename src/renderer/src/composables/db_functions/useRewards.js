// ========== COMPOABLE PROVIDING DATABASE FUNCTIONS FOR REWARDS ========== 
import { ref } from 'vue'
import { useToasts } from '../ui/useToasts'

const { addToast } = useToasts()

export function useRewards() {
    const rewards = ref([])
    const rewardData = ref({
        title: '',
        cost: 0,
        rank: 'common',
        repeatable: false
    })
    
    const getRewards = async () => {
        rewards.value = await window.api.getRewards()
    }

    const addReward = async (reward) => {
        return await window.api.addReward(reward)
    }

    const editReward = async (reward) => {
        return await window.api.editReward(reward)
    }

    const deleteReward = async (id) => {
        return await window.api.deleteReward(id)
    }

    const onRewardsUpdate = (callback) => {
        return window.api.onRewardsUpdate(callback)
    }
    
    const unlockReward = async (reward) => {
        try {
            const result = await window.api.unlockReward(reward); // returns { success: boolean, message: string, rewardCost: number }
            if (result.success) {
              addToast({message: '-' + result.rewardCost + ' Crystals', type: 'crystals'})
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
        rewards,
        rewardData,
        getRewards,
        addReward,
        editReward,
        deleteReward,
        unlockReward,
        onRewardsUpdate
    }
}
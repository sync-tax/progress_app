import { ref } from 'vue'

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

    const addReward = async () => {
        return await window.api.addReward()
    }

    const updateReward = async (reward) => {
        return await window.api.updateReward(reward)
    }

    const deleteReward = async (id) => {
        return await window.api.deleteReward(id)
    }
    
    const unlockReward = async (reward) => {
        return await window.api.unlockReward(reward)
    }

    const onRewardsUpdate = (callback) => {
        return window.api.onRewardsUpdate(callback)
    }

    return {
        rewards,
        rewardData,
        getRewards,
        addReward,
        updateReward,
        deleteReward,
        unlockReward,
        onRewardsUpdate
    }
}
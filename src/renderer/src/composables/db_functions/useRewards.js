import { ref } from 'vue'

export function useRewards() {
    const rewards = ref([])
    const rewardData = ref({
        title: '',
        cost: 0,
        rank: 'common',
        repeatable: false
    })
    
    const fetchRewards = async () => {
        rewards.value = await window.api.getRewards()
    }

    const addReward = async (reward) => {
        return await window.api.addReward(reward)
    }

    const updateReward = async (reward) => {
        return await window.api.updateReward(reward)
    }

    const deleteReward = async (id) => {
        return await window.api.deleteReward(id)
    }

    return {
        rewards,
        rewardData,
        fetchRewards,
        addReward,
        updateReward,
        deleteReward
    }
}
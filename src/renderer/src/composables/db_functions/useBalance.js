
import { ref } from 'vue'    

export function useBalance() {
    const balance = ref(0)

    const fetchBalance = async () => {
        balance.value = await window.api.getBalance()
    }

    const removeBalance = async (amount) => {
        return await window.api.removeBalance(amount)
    }

    const addBalance = async (amount) => {
        return await window.api.addBalance(amount)
    }

    return {
        balance,
        fetchBalance,
        removeBalance,
        addBalance
    }
}

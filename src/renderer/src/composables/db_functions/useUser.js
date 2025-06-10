/**
 * BALANCE RELATED COMPOSABLE
 * --------------------------------------------------------------------------------------------------------------
 * @var balance {number} - balance data
 * @function getBalance {function} - Gets balance from the database
 * @function removeBalance {function} - Removes balance from the database
 * @function addBalance {function} - Adds balance to the database
 * @function onBalanceUpdate {function} - Listens for balance updates from the database
 */
import { ref } from 'vue'

export function useUser() {
    const balance = ref(0)

    const getBalance = async () => {
        balance.value = await window.api.getBalance()
    }

    const onBalanceUpdate = () => {
      return window.api.onBalanceUpdate(newBalance => {
        balance.value = newBalance
      })
    }

    return {
        balance,
        getBalance,
        onBalanceUpdate
    }
}

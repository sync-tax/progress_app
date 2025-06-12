import { ref } from 'vue'
/**
 * USER RELATED COMPOSABLE
 * --------------------------------------------------------------------------------------------------------------
 * @var balance {number} - balance data
 * @function getBalance {function} - Gets balance from the database
 * @function onBalanceUpdate {function} - Listens for balance updates from the database
 */
export function useUser() {
  const balance = ref(0)
  const exp_current = ref(0)
  const exp_needed = ref(0)
  const level = ref(0)

  const getBalance = async () => {
    balance.value = await window.api.getBalance()
  }

  const getUserExp = async () => {
    const result = await window.api.getUserExp()
    exp_current.value = result.expCurrent
    exp_needed.value = result.expNeeded
  }

  const onBalanceUpdate = () => {
    return window.api.onBalanceUpdate((newBalance) => {
      balance.value = newBalance
    })
  }

  const onUserExpUpdate = () => {
    return window.api.onUserExpUpdate((newExpCurrent, newExpNeeded) => {
      exp_current.value = newExpCurrent
      exp_needed.value = newExpNeeded
    })
  }

  const getUserLevel = async () => {
    level.value = await window.api.getUserLevel()
    console.log(level.value)
  }

  const onUserLevelUpdate = () => {
    return window.api.onUserLevelUpdate((newLevel) => {
      level.value = newLevel
    })
  }

  return {
    level,
    balance,
    exp_current,
    exp_needed,
    getBalance,
    onBalanceUpdate,
    getUserExp,
    onUserExpUpdate,
    getUserLevel,
    onUserLevelUpdate
  }
}

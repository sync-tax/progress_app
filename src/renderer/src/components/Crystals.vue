<script setup>
import { ref, onMounted} from 'vue'

const balance = ref(0)

const updateBalance = (newBalance) => {
  balance.value = newBalance
}

onMounted(async () => {
  // Initial fetch
  balance.value = await window.api.getBalance()

  // Listen for balance updates
  window.api.onBalanceUpdate(updateBalance)
})

</script>

<template>
  <div class="balanceWrapper">
    <img src="../assets/crystal.png" alt="Crystal Symbol">
    <p class="balance">
      {{ balance }} 
    </p>
  </div>
</template>
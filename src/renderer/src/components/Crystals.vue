<script setup>
import { ref, onMounted } from 'vue'

const balance = ref(0)

onMounted(async () => {
    balance.value = await window.api.getBalance()
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
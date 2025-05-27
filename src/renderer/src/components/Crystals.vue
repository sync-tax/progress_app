<script setup>
import { ref } from 'vue'

const balance = ref(13223)
</script>

<template>
  <div class="balanceWrapper">
    <img src="../assets/crystal.png" alt="Crystal Symbol">
    <p class="balance">
      {{ balance }} 
    </p>
  </div>
</template>
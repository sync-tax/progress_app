<script setup>
const minimize = () => window.api.windowControl('minimize')
const close = () => window.api.windowControl('close')
</script>

<template>
  <div class="dragBar">
    <div class="windowControls">
      <button id="min" @click="minimize">
        –
      </button>
      <button id="close" @click="close">
        ✕
      </button>
    </div>
  </div>
</template>



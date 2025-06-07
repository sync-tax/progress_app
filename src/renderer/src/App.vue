<script setup>
import Dragbar from './components/Dragbar.vue'
import Navigation from './components/Navigation.vue';
import Crystals from './components/Crystals.vue'
import ToastContainer from './components/ToastContainer.vue'
</script>

<template>
  <body>
    <Dragbar />
    <Navigation />
    <Crystals />
    <ToastContainer />
    <main>
      <router-view v-slot="{ Component }">
          <component :is="Component" />
      </router-view>
    </main>
  </body>
</template>

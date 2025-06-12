<script setup>
import Dragbar from './components/Dragbar.vue'
import Navigation from './components/Navigation.vue';
import Crystals from './components/Crystals.vue'
import ExpBar from './components/ExpBar.vue'
import ToastContainer from './components/ToastContainer.vue'
</script>

<template>
  <body>
    <Dragbar />
    <Navigation />
    <Crystals />
    <ToastContainer />
    <ExpBar />
    <main>
      <router-view v-slot="{ Component }">
          <component :is="Component" />
      </router-view>
    </main>
  </body>
</template>

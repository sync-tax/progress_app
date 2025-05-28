<script setup>
import Dragbar from './components/Dragbar.vue'
import Navigation from './components/Navigation.vue';
import Crystals from './components/Crystals.vue'
</script>

<template>
  <body>
    <Dragbar />
    <Navigation />
    <Crystals />
    <main>
      <router-view v-slot="{ Component }">
        <transition name="route">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </body>
</template>
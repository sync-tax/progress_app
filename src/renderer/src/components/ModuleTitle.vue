<script setup>
const props = defineProps({
    title: String,
})
</script>

<template>
    <div class="moduleTitle">
        <h1>{{ title }}</h1>
    </div>
</template>
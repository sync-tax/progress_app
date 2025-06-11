<script setup>
import ConstructionIcon from '../assets/construction.svg'

const props = defineProps({
    text: String,
})
</script>

<template>
    <div class="construction">
        <ConstructionIcon id="constructionIcon" />
        <h1>{{ text }}</h1>
    </div>
</template>
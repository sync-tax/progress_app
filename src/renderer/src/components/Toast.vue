<script setup>
defineProps({
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        default: 'info', // 'info', 'success', 'warning', 'error'
    }
})
defineEmits(['close'])
</script>

<template>
    <div :class="['toast', `toast-${type}`]" @click="$emit('close')">
        <img v-if="type === 'minusCrystals' || type === 'plusCrystals'" src="../assets/crystal.png" alt="crystal cost" style="width: 20px; height: 20px;">
        <p>{{ message }}</p>
    </div>
</template>

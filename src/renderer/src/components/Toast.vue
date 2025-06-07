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
        <p>{{ message }}</p>
    </div>
</template>

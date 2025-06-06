<script setup>
import { onMounted } from 'vue'
import { useTags } from '../../composables/db_functions/useTags'
import { useHabits } from '../../composables/db_functions/useHabits'
import { useModalActions } from '../../composables/modal_functions/useModalActions'

const { fetchTags, tags } = useTags()
const { habitData, addHabit } = useHabits()
onMounted(async () => {
    fetchTags()
})

const emit = defineEmits(['close'])

const save = async () => {
    if (!habitData.value.title.trim()) return
    await addHabit({ 
        title: habitData.value.title.trim(), 
        tag_name: habitData.value.tag_name
    })
    emit('close')
}

const cancel = () => {
    emit('close')
}

useModalActions({
    onSave: () => {
        save()
    },
    onCancel: () => {
        cancel()
    }
})
</script>

<template>
    <div class="modalWrapper">
        <div class="addModal">
            <h4>Add Habit</h4>
            <input v-model="habitData.title" type="text" placeholder="Title..." spellcheck="false">
            <select v-model="habitData.tag_name">
                <option v-for="tag in tags" :key="tag.id" :value="tag.title">{{ tag.title }}</option>
            </select>
            <span>ESC = Cancel | ENTER = Save</span>
        </div>
    </div>
</template>

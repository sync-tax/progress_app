<script setup>
import { useIdeas } from '../../composables/db_functions/useIdeas'
import { useModalActions } from '../../composables/modal_functions/useModalActions'

const { ideaData, addIdea } = useIdeas()
const emit = defineEmits(['close'])

const save = async () => {
    if (!ideaData.value.title.trim()) return
    await addIdea({ title: ideaData.value.title.trim(), description: ideaData.value.description.trim(), rank: ideaData.value.rank })
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
            <h4>Add Idea</h4>
            <input v-model="ideaData.title" type="text" placeholder="Title..." spellcheck="false">

            <textarea v-model="ideaData.description" placeholder="Description..." rows="3" maxlength="90"></textarea>
            <select v-model="ideaData.rank">
                <option value="common">Common</option>
                <option value="uncommon">Uncommon</option>
                <option value="rare">Rare</option>
                <option value="epic">Epic</option>
                <option value="legendary">Legendary</option>
            </select>

            <span>ESC = Cancel | ENTER = Save</span>
        </div>
    </div>
</template>

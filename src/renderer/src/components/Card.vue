<script setup>
// ========== IMPORTS ==========
// Icons
import EditIcon from '../assets/edit.svg';
import IdeaIcon from '../assets/idea.svg';

// ========== DATA ==========
const props = defineProps({
    itemData: {
        type: Object,
        required: true
    },
    itemType: {
        type: String,
        required: true,
        validator: (value) => ['reward', 'tag', 'idea', 'habit'].includes(value) // 'habit' for future extensibility
    }
});

// ========== EMITS ========== 
const emit = defineEmits(['start-edit', 'unlock-reward']);

// ========== FUNCTIONS ========== 
// Initializes edit mode
const handleEditClick = () => {
    emit('start-edit', props.itemData);
};

// Initializes reward unlock mode (REWARD)
const handleRewardUnlock = () => {
    if (props.itemType === 'reward') {
        emit('unlock-reward', props.itemData);
    }
};

const handleIdeaToProjectConversion = () => {
    if (props.itemType === 'idea') {
        emit('idea-to-project', props.itemData);
    }
}

// ========== HELPERS ========== 
// TODO: move to composables 
// Returns rank based on level (TAGS)
const getRank = (tag) => {
    if (tag.level >= 55) return 'legendary'
    else if (tag.level >= 40) return 'epic'
    else if (tag.level >= 25) return 'rare'
    else if (tag.level >= 10) return 'uncommon'
    else return 'common'
}
</script>


<template>
    <div class="cardWrapper">
        <!-- IDEA -->
        <template v-if="itemType === 'idea'">
            <div class="bulbWrapper">
              <IdeaIcon class="bulb" @click="handleIdeaToProjectConversion()"/>
            </div>

            <div class="ideaContent">
              <h4>{{ itemData.title }}</h4>
              <p>{{ itemData.description }}</p>
            </div>

            <div class="editIconContainer" @click="startEditing(itemData)">
              <EditIcon class="editIcon" />
            </div>
        </template>

        <!-- TAG -->
        <template v-if="itemType === 'tag'">
            <div class="rankGems">
                <img v-if="getRank(itemData) == 'legendary'" src="../assets/LEGENDARY_MARK.png" alt="tagIcon"
                    class="rankMark" :class="getRank(itemData) + '-glow'">
                <img v-if="getRank(itemData) == 'epic'" src="../assets/EPIC_MARK.png" alt="tagIcon" class="rankMark"
                    :class="getRank(itemData) + '-glow'">
                <img v-if="getRank(itemData) == 'rare'" src="../assets/RARE_MARK.png" alt="tagIcon" class="rankMark"
                    :class="getRank(itemData) + '-glow'">
                <img v-if="getRank(itemData) == 'uncommon'" src="../assets/UNCOMMON_MARK.png" alt="tagIcon"
                    class="rankMark" :class="getRank(itemData) + '-glow'">
                <img v-if="getRank(itemData) == 'common'" src="../assets/COMMON_MARK.png" alt="tagIcon" class="rankMark"
                    :class="getRank(itemData) + '-glow'">
            </div>
            <div class="tagContent">
                <div class="cardContent">
                    <h4>
                        {{ itemData.title }}
                    </h4>
                    <p class="tagLvl">
                        Level {{ itemData.level }}
                    </p>
                </div>
            </div>
            <progress class="expBar" :value="itemData.exp_current" :max="itemData.exp_needed">
                EXP
            </progress>
        </template>

        <!-- REWARD -->
        <template v-if="itemType === 'reward'">
            <div class="costWrapper" @click="handleRewardUnlock()">
                <img src="../assets/crystal.png" alt="crystal cost">
                <p>{{ itemData.cost }}</p>
            </div>
            <div class="cardContent">
                <h4>{{ itemData.title }}</h4>
            </div>
        </template>
        <div class="editIconContainer" @click="handleEditClick()">
            <EditIcon class="editIcon" />
        </div>
    </div>
</template>

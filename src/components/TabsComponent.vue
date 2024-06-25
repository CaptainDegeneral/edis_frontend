<script setup>
import { ref } from 'vue';

const activeTab = ref('profile');

const setActiveTab = (tab) => {
    activeTab.value = tab;
}
</script>

<template>
    <div class="w-full">
        <div class="grid grid-cols-2 space-x-4">
            <button :class="{ 'text-blue-500': activeTab === 'profile' }" @click="setActiveTab('profile')">
                Профиль
            </button>
            <button :class="{ 'text-blue-500': activeTab === 'courses' }" @click="setActiveTab('courses')">
                Курсы
            </button>
        </div>
        <div class="mt-4 relative">
            <slot name="profile" v-if="activeTab === 'profile'"></slot>
            <slot name="courses" v-if="activeTab === 'courses'"></slot>
        </div>
    </div>
</template>

<style scoped>
button {
    padding: 10px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 16px;
}

button:hover {
    color: #1c64f2;
}

button.text-blue-500 {
    font-weight: bold;
    border-bottom: 2px solid #1c64f2;
}
</style>

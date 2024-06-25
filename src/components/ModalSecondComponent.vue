<script setup>

import { defineProps, computed, ref } from 'vue';

const props = defineProps({
    type: {
        type: String,
        default: 'Success'
    },
    title: {
        type: String,
        default: 'Title'
    },
    subtitle: {
        type: String,
        default: 'Subtitle'
    },
    text: {
        type: String,
        default: 'Text'
    }
})

const iconImage = computed(() => {
    if (props.type === 'Success') { return `url('/icon-success.svg')`; }
    else if (props.type === 'Error') { return `url('/icon-error.svg')`; }
    return ''
});

const isModalVisible = ref(true);

const hideModal = () => { isModalVisible.value = false; };

</script>

<template>
    <div v-if="isModalVisible"
        class="z-50 fixed inset-0 flex flex-col items-center justify-center bg-gray-500 bg-opacity-70" tabindex="0">
        <div class="w-96 bg-white flex flex-col items-center justify-center rounded-xl">
            <p class="p-8 text-3xl text-center font-medium text-gray-700">{{ props.title }}</p>
            <div class="relative w-20 h-20 bg-center bg-no-repeat animate-pulse"
                :style="{ backgroundImage: iconImage }">
            </div>
            <p class="p-8 text-2xl text-center font-normal text-gray-700">{{ props.subtitle }}</p>
            <p class="pb-8 px-8 text-base text-center font-normal text-gray-700">{{ props.text }}</p>
            <button type="button" @click="hideModal"
                class="py-2.5 px-5 mb-8 text-lg font-bold text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                OK
            </button>
        </div>
    </div>
</template>

<style></style>
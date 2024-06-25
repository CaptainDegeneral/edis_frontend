<template>
    <div class="flex flex-row gap-3 items-center justify-between pb-6 border-b border-gray-200">
        <div class="flex flex-row gap-3 items-center">
            <svg class="w-16 h-16 text-blue-900">
                <use :xlink:href="props.icon"></use>
            </svg>
            <h1 class="text-4xl text-blue-900 font-bold dark:text-white">{{ props.title }}</h1>
        </div>
        <div class="pl-10 flex flex-row items-center gap-6">
            <slot name="search"></slot>
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    icon: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
});
</script>

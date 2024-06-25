<template>
    <div>
        <button type="submit" :disabled="props.hasErrors && props.hasErrors.length > 0"
            class="w-full text-lg text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg px-5 py-2.5 text-center disabled:bg-gray-400 disabled:cursor-not-allowed dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
            {{ props.buttonText }}
        </button>
        <div v-if="props.loginText" class="flex justify-center mt-4">
            <p class="text-base text-center font-light text-gray-500 dark:text-gray-400">
                {{ props.loginText }}
                <router-link :to="props.link"
                    class="text-base font-medium text-primary-600 hover:underline dark:text-primary-500">
                    {{ props.linkText }}
                </router-link>
            </p>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    buttonText: {
        type: String,
        required: true
    },
    loginText: {
        type: String,
        required: false
    },
    linkText: {
        type: String,
        required: false
    },
    link: {
        type: String,
        required: false
    },
    hasErrors: {
        type: Array,
        default: () => []
    }
});
</script>

<style scoped></style>

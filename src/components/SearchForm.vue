<script setup>
import { ref, defineEmits } from 'vue';

const searchQuery = ref('');
const emit = defineEmits(['search', 'clear']);

const handleSubmit = () => {
    emit('search', searchQuery.value);
};

const handleClear = () => {
    searchQuery.value = '';
    emit('clear');
};
</script>

<template>
    <form @submit.prevent="handleSubmit" autocomplete="off" class="flex items-center max-w-sm mx-auto">
        <label for="simple-search" class="sr-only">Search</label>
        <div class="relative w-full">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg class="w-6 h-6 text-gray-400 dark:text-gray-400" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    </circle>
                    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"></circle>
                    <path
                        d="M17.7805 18.8264C17.9076 18.7566 17.9678 18.6055 17.914 18.4708C17.5284 17.5045 16.7856 16.6534 15.7814 16.0332C14.6966 15.3632 13.3674 15 12 15C10.6326 15 9.30341 15.3632 8.21858 16.0332C7.21444 16.6534 6.4716 17.5045 6.08598 18.4708C6.03223 18.6055 6.09236 18.7566 6.21948 18.8264C9.81971 20.803 14.1803 20.803 17.7805 18.8264Z"
                        fill="currentColor"></path>
                </svg>
            </div>
            <input autocomplete="off" type="text" id="simple-search" v-model="searchQuery"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Начните поиск здесь..." required />
        </div>
        <button type="submit"
            class="p-3 ms-2 text-base font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
            <span class="sr-only">Найти</span>
        </button>
        <button type="button"
            class="p-2 ms-2 text-base font-medium text-gray-500 bg-transparent rounded-lg border border-gray-300 hover:text-gray-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:text-gray-400 dark:border-gray-600 dark:hover:text-gray-300 dark:focus:ring-blue-800"
            @click="handleClear">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z"
                    fill="currentColor"></path>
            </svg>
            <span class="sr-only">Очистить</span>
        </button>
    </form>
</template>

<style></style>

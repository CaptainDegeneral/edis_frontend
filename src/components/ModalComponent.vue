<script setup>

import { defineProps, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
    isBlured: { type: Boolean, default: false },
    type: { type: String, default: '' }
})

const route = useRoute();
const router = useRouter();

const isModalVisible = ref(true);

const hideModal = () => {
    if (route.path === '/verify-email' && props.type != 'awaiting') { router.push('/signin'); }
    else if (route.path === '/password-reset' && props.type != 'awaiting') { router.push('/signin'); }
    else if (route.name === 'PasswordResetConfirm' && props.type != 'awaiting') { router.push('/signin'); }
    else { isModalVisible.value = false; }
};

</script>

<template>
    <div class="absolute z-50" v-if="isModalVisible">
        <div class="h-screen w-screen flex items-center justify-center" :class="{ 'bg-white/[.7]': props.isBlured }">
            <div class="h-fit w-fit flex items-center justify-center">
                <div id="popup-modal" tabindex="-1"
                    class="overflow-y-auto overflow-x-hidden justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                    <div class="relative p-4 w-full max-w-md max-h-full">
                        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <button type="button" @click="hideModal"
                                class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                data-modal-hide="popup-modal">
                                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 14 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span class="sr-only">Close modal</span>
                            </button>
                            <div class="p-4 md:p-5 text-center">
                                <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <slot></slot>
                                <button type="submit" @click="hideModal"
                                    class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    Ок
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style></style>
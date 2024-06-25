<template>
    <teleport v-if="props.to" :to="props.to">
        <div ref="rootElementRef"
            class="z-50 fixed inset-0 flex flex-col items-center justify-center bg-gray-500 bg-opacity-70" tabindex="0"
            @focusout="catchFocus">
            <div class="w-fit bg-white flex flex-col items-center justify-center rounded-xl">
                <div class="p-8">
                    <p class="text-3xl font-medium text-gray-700">Пожалуйста, подождите...</p>
                </div>
                <div class="relative w-20 h-20 bg-center bg-no-repeat animate-spin"
                    style="background-image: url('/spinner-icon.svg');">
                </div>
                <div class="p-8 text-center">
                    <slot></slot>
                </div>
            </div>
        </div>
    </teleport>
    <div v-else ref="rootElementRef"
        class="z-50 fixed inset-0 flex flex-col items-center justify-center bg-gray-500 bg-opacity-70" tabindex="0"
        @focusout="catchFocus">
        <div class="w-fit bg-white flex flex-col items-center justify-center rounded-xl">
            <div class="p-8">
                <p class="text-3xl font-medium text-gray-700">Пожалуйста, подождите...</p>
            </div>
            <div class="relative w-20 h-20 bg-center bg-no-repeat animate-spin"
                style="background-image: url('/spinner-icon.svg');">
            </div>
            <div class="p-8 text-center">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, onMounted, onUnmounted, ref } from 'vue';

const props = defineProps({
    to: { type: String, default: null },
    fullscreen: { type: Boolean, default: false },
    shouldCatchFocus: { type: Boolean, default: false },
});

const rootElementRef = ref(null);
const lastActiveElement = ref(null);

function storeLastActiveElement() {
    lastActiveElement.value = document.activeElement;
}

function catchFocus() {
    rootElementRef.value?.focus();
}

function restoreLastFocus() {
    lastActiveElement.value?.focus();
}

onMounted(() => {
    storeLastActiveElement();
    if (props.shouldCatchFocus) catchFocus();
});

onUnmounted(() => {
    restoreLastFocus();
});
</script>
<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
    user: { type: Object, required: true }
})

const emit = defineEmits(['getUser'])

const getUser = () => { emit('getUser', props.user.id) }

const circleClass = computed(() => {
  return props.user.is_verified
    ? 'h-4 w-4 rounded-full bg-green-600 mr-2'
    : 'h-4 w-4 rounded-full bg-red-600 mr-2';
});
</script>

<template>
    <button @click.prevent="getUser"
        class="block col-span-1 w-full p-3 my-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
        <div class="grid grid-cols-4 gap-4">
            <div class="col-span-3 border-r border-gray-200 flex flex-col items-start justify-between text-left">
                <div class="flex flex-row items-center justify-between">
                  <div :class="circleClass"></div>
                  <h5 class="text-base text-left font-bold tracking-tight text-gray-900">
                    {{ props.user.first_name }} {{ props.user.last_name }}
                  </h5>
                  <div v-if="props.user.up > 0">
                    <span class="bg-yellow-100 text-yellow-800 text-xs font-medium ms-2 px-2 py-1 rounded dark:bg-yellow-900 dark:text-yellow-300">
                      {{ props.user.up > 10 ? "10+" : props.user.up }}
                    </span>
                  </div>
                </div>
                <p class="text-left font-normal text-gray-700">
                    {{ props.user.email }}
                </p>
            </div>
            <div class="grid grid-cols-2 gap-2">
                <div>
                    <p class="text-lg text-gray-700">ПП:</p>
                    <p class="text-lg text-gray-700">ПК:</p>
                </div>
                <div>
                    <p class="text-lg text-gray-700">{{ props.user.pp }}</p>
                    <p class="text-lg text-gray-700">{{ props.user.pk }}</p>
                </div>
            </div>
        </div>
    </button>
</template>

<style></style>

<script setup>

import { defineProps, computed } from "vue";

const props = defineProps({
    type: { type: String, default: 'users' },
    items: { type: Array, required: true }
})

const title = computed(() => {
    if (props.type === 'users') { return `Пользователи не найдены`; }
    if (props.type === 'courses' || props.type === 'current_courses ') { return `Курсы не найдены`; }
    return ''
});

const subtitle = computed(() => {
  if (props.type === 'users') { return `Проверьте поисковой запрос и попробуйте снова`; }
  if (props.type === 'courses') { return `Выбранный пользователь ещё не добавил ни одного курса`; }
  if (props.type === 'current_courses') { return `Вы ещё не добавили ни одного курса`; }
  return ''
});

const image = computed(() => {
    if (props.type === 'users') { return `url('/icon-users-not-found.svg')`; }
    if (props.type === 'courses' || props.type === 'current_courses') { return `url('/icon-no-courses.svg')`; }
    return ''
});

</script>

<template>
    <div v-if="props.items.length === 0" class="w-full flex flex-col items-center justify-center">
        <div class="w-96 flex flex-col items-center justify-center">
            <div class="w-48 h-48 bg-center bg-cover bg-no-repeat" :style="{ backgroundImage: image }"></div>
        </div>
        <p class="text-center font-semibold pb-4 text-3xl text-gray-700"
           :class="{ 'mt-6': props.type === 'courses' || props.type === 'current_courses', }">
          {{ title }}
        </p>
        <p class="text-center text-xl font-semibold text-gray-600">{{ subtitle }}</p>
    </div>
</template>

<style></style>
<script setup>
import { defineProps, ref, computed } from 'vue';
import UserCourseItem from '@/components/UserCourseItem.vue';
import NotFound from '@/components/NotFound.vue';
import { api } from '@/modules/axios-config.js';
import emitter from '@/modules/eventBus.js';

const props = defineProps({
  userCourses: { type: Array, required: true }
});

const currentType = ref('all');

const filteredCourses = computed(() => {
  if (currentType.value === 'all') {
    return props.userCourses;
  }
  return props.userCourses.filter(course => course.type_of_education === currentType.value);
});

const emit = defineEmits([
  'updateCoursesList',
]);

const updateCourseStatus = async (courseID) => {
  try {
    await api.patch(`/courses/processed/${courseID}`);
    emit('updateCoursesList');
    emitter.emit('updateCoursesList');
  } catch (e) {
    console.error('Error updating course status:', e);
  } finally {
    console.log('Updating courses status completed.');
  }
};

</script>

<template>
  <div class="p-4">
    <div v-if="userCourses.length > 0" class="grid grid-cols-3 gap-0 mb-4">
      <button
        @click.prevent="currentType = 'ПК'"
        :class="['py-2 px-4 focus:outline-none transition duration-300',
              currentType === 'ПК' ? 'bg-white text-gray-900 text-lg font-semibold border-b-4 border-gray-300' : 'bg-white text-lg text-gray-700',
              'hover:bg-gray-100 hover:text-gray-900']"
      >
        ПК
      </button>
      <button
        @click.prevent="currentType = 'all'"
        :class="['py-2 px-4 focus:outline-none transition duration-300',
              currentType === 'all' ? 'bg-white text-gray-900 text-lg font-semibold border-b-4 border-gray-300' : 'bg-white text-lg text-gray-700',
              'hover:bg-gray-100 hover:text-gray-900']"
      >
        Все
      </button>
      <button
        @click.prevent="currentType = 'ПП'"
        :class="['py-2 px-4 focus:outline-none transition duration-300',
              currentType === 'ПП' ? 'bg-white text-gray-900 text-lg font-semibold border-b-4 border-gray-300' : 'bg-white text-lg text-gray-700',
              'hover:bg-gray-100 hover:text-gray-900']"
      >
        ПП
      </button>
    </div>
    <div v-if="filteredCourses.length === 0" class="mt-24">
      <not-found type="courses" :items="filteredCourses"></not-found>
    </div>
    <div v-else class="max-h-[27rem] overflow-y-auto pr-4">
      <ul class="space-y-4">
        <li
          v-for="course in filteredCourses"
          :key="course.id"
        >
          <UserCourseItem
            @update-course-checking="updateCourseStatus"
            :course="course"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>

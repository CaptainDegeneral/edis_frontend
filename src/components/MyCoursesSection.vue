<script setup>

import SectionHeader from '@/components/SectionHeader.vue'

import { computed, onMounted, ref } from 'vue'
import { api } from '@/modules/axios-config.js'
import Loader from '@/components/LoaderWithText.vue'
import NotFound from '@/components/NotFound.vue'
import MyCourseModal from '@/components/MyCourseModal.vue'

const currentType = ref('all');
const courses = ref(Array)

const isLoading = ref(false)

const fetchCourses = async () => {
  isLoading.value = true

  api.get(`/courses/user/current`)
    .then(response => {
      courses.value = response.data
    })
    .catch(() => {
      isLoading.value = false
    })
    .finally(() => {
      isLoading.value = false
    })
}

const filteredCourses = computed(() => {
  if (currentType.value === 'all') {
    return courses.value;
  }
  return courses.value.filter(course => course.type_of_education === currentType.value);
});

onMounted(fetchCourses)

const selectedCourse = ref(null)

const isShowDetail = ref(false)

const closeModal = (e) => {
  isShowDetail.value = e
}

const showCourseDetail = (course) => {
  selectedCourse.value = course
  isShowDetail.value = true
}

</script>

<template>
  <transition>
    <my-course-modal :course="selectedCourse" v-if="isShowDetail" @close-modal="closeModal"></my-course-modal>
  </transition>
  <transition>
    <loader v-if="isLoading" :fullscreen="true" :should-catch-focus="true">
      <template #default>
        <div class="w-96">
          <p class="pb-4 text-2xl font-normal text-gray-700">Загрузка</p>
          <p class="text-base font-normal text-gray-700">
            Загружаем информацию о курсах. Это может занять некоторое время.
            Пожалуйста, подождите немного.
          </p>
        </div>
      </template>
    </loader>
    <div v-else-if="!isLoading">
      <section-header icon="/sprite.svg#icon-my-courses-2" title="Мои курсы">
        <button class="w-10 h-10 text-blue-600 hover:text-blue-800" @click.prevent="fetchCourses">
          <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M1.84998 7.49998C1.84998 4.66458 4.05979 1.84998 7.49998 1.84998C10.2783 1.84998 11.6515 3.9064 12.2367 5H10.5C10.2239 5 10 5.22386 10 5.5C10 5.77614 10.2239 6 10.5 6H13.5C13.7761 6 14 5.77614 14 5.5V2.5C14 2.22386 13.7761 2 13.5 2C13.2239 2 13 2.22386 13 2.5V4.31318C12.2955 3.07126 10.6659 0.849976 7.49998 0.849976C3.43716 0.849976 0.849976 4.18537 0.849976 7.49998C0.849976 10.8146 3.43716 14.15 7.49998 14.15C9.44382 14.15 11.0622 13.3808 12.2145 12.2084C12.8315 11.5806 13.3133 10.839 13.6418 10.0407C13.7469 9.78536 13.6251 9.49315 13.3698 9.38806C13.1144 9.28296 12.8222 9.40478 12.7171 9.66014C12.4363 10.3425 12.0251 10.9745 11.5013 11.5074C10.5295 12.4963 9.16504 13.15 7.49998 13.15C4.05979 13.15 1.84998 10.3354 1.84998 7.49998Z" fill="currentColor"></path> </g></svg>
        </button>
      </section-header>
      <div class="grid grid-cols-3 gap-0 mb-4">
        <button
          @click.prevent="currentType = 'ПК'"
          :class="['py-2 px-4 focus:outline-none transition duration-300',
              currentType === 'ПК' ? 'bg-white text-gray-900 text-lg font-semibold border-b-4 border-gray-300' : 'bg-white text-lg text-gray-700',
              'hover:bg-gray-100 hover:text-gray-900']"
        >
          Повышение квалификации
        </button>
        <button
          @click.prevent="currentType = 'all'"
          :class="['py-2 px-4 focus:outline-none transition duration-300',
              currentType === 'all' ? 'bg-white text-gray-900 text-lg font-semibold border-b-4 border-gray-300' : 'bg-white text-lg text-gray-700',
              'hover:bg-gray-100 hover:text-gray-900']"
        >
          Все курсы
        </button>
        <button
          @click.prevent="currentType = 'ПП'"
          :class="['py-2 px-4 focus:outline-none transition duration-300',
              currentType === 'ПП' ? 'bg-white text-gray-900 text-lg font-semibold border-b-4 border-gray-300' : 'bg-white text-lg text-gray-700',
              'hover:bg-gray-100 hover:text-gray-900']"
        >
          Проф. переподготовка
        </button>
      </div>
      <div v-if="filteredCourses.length === 0 && !isLoading" class="mt-24">
        <not-found type="current_courses" :items="filteredCourses"></not-found>
      </div>
      <div
        v-else
        class="w-full grid grid-cols-2 gap-4 cards-list"
      >
        <div
          v-for="(course, index) in filteredCourses"
          :key="index"
          class="flex border border-gray-300 rounded-lg shadow-md bg-white"
        >
          <button @click.prevent="showCourseDetail(course)" class="p-4 grid grid-cols-4 gap-y-2 card">
            <span class="col-span-4 flex flex-col">
              <strong>Наименование программы:</strong>
              <span class="text-left">{{ course.program_name }} <span v-if="course.cycle_commission">(ЦК: {{ course.cycle_commission }})</span></span>
            </span>
            <span class="w-full flex justify-between">
              <span class="col-span-2">
              <span class="flex flex-col">
                <strong>Тип курса:</strong>
                {{ course.type_of_education === 'ПП' ? 'Профессиональная переподготовка' : 'Повышение квалификации' }}</span>
            </span>
            <span class="col-span-2">
              <span class="flex flex-col">
                <strong>Период прохождения:</strong>
                {{ course.training_period }} ({{ course.hours }} ч.)
              </span>
            </span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.cards-list {
  overflow-y: auto;
  height: 30rem;
}

.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
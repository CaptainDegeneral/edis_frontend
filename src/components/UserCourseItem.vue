<script setup>
import { defineProps, ref, watch } from 'vue'
import TogglerComponent from '@/components/TogglerComponent.vue'

const props = defineProps({
  course: { type: Object, required: true }
});

const emit = defineEmits([
  'updateCourseChecking',
]);

const courseChecking = ref(props.course.is_processed);

const formatted = ref(false);

const changeStatus = () => {
  formatted.value = !formatted.value;
};

const getDate = (date) => {
  return new Date(date).toLocaleDateString('ru-RU');
};

watch(courseChecking, () => {
  emit('updateCourseChecking', props.course.id);
});

</script>

<template>
  <div class="relative">
    <button
      @click.prevent="changeStatus"
      class="absolute top-0 right-0 mt-2 mr-2 filter-btn h-9 w-9"
      :class="{
          'transform rotate-90 transition-transform duration-500': formatted,
          'transform -rotate-90 transition-transform duration-500': !formatted
      }"
    >
      <svg class="h-9 w-9 text-blue-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <use href="/sprite.svg#icon-format"></use>
      </svg>
    </button>
      <div class="p-4 border border-gray-300 rounded-lg shadow-md bg-white">
        <div v-if="!formatted" class="grid grid-cols-4 gap-y-2">
          <div class="col-span-4 flex flex-col pr-10">
            <strong>Наименование программы:</strong>
            <p>{{ course.program_name }} <span v-if="course.cycle_commission">(ЦК: {{ course.cycle_commission }})</span></p>
          </div>
          <div class="col-span-2">
            <p class="flex flex-col">
              <strong>Тип курса:</strong>
              {{ course.type_of_education === 'ПП' ? 'Профессиональная переподготовка' : 'Повышение квалификации' }}</p>
          </div>
          <div class="col-span-2">
            <p class="flex flex-col">
              <strong>Период прохождения:</strong>
              {{ course.training_period }} ({{ course.hours }} ч.)
            </p>
          </div>
          <div class="col-span-2">
            <p class="flex flex-col">
              <strong>Город прохождения:</strong>
              {{ course.city }}
            </p>
          </div>
          <div class="col-span-2">
            <p class="flex flex-col">
              <strong>Место прохождения:</strong>
              {{ course.training_place }}
            </p>
          </div>
          <div class="col-span-2">
            <p class="flex flex-col">
              <strong>Тип документа:</strong>
              {{ course.document_type === 'У' ? 'Удостоверение' : 'Диплом' }}
            </p>
          </div>
          <div class="col-span-2">
            <p class="flex flex-col">
              <strong>Дата выдачи:</strong>
              {{ getDate(course.issue_date) }}
            </p>
          </div>
          <div class="col-span-2">
            <p class="flex flex-col">
              <strong>Номер:</strong>
              {{ course.certificate_number }}
            </p>
          </div>
          <div class="col-span-2">
            <p class="flex flex-col">
              <strong>Рег. номер:</strong>
              {{ course.registration_number }}
            </p>
          </div>
          <div v-if="course.qualification" class="col-span-4 mt-2">
            <p class="flex flex-col">
              <strong>Квалификация:</strong>
              {{ course.qualification }}
            </p>
          </div>
        </div>
        <div v-else class="pr-10">
          <p class="text-base text-gray-600 font-medium">
            {{ course.formatted_course_info }}
          </p>
          <p v-if="course.qualification" class="text-base text-gray-800 font-medium mt-2">
            <strong>Квалификация:</strong>
            {{ course.qualification }}
          </p>
        </div>
        <div class="w-full pt-4 mt-4 border-t border-gray-200">
          <toggler-component
            v-model:model-value="courseChecking"
            label="Обработано"
          />
        </div>
      </div>
  </div>
</template>

<style scoped>
</style>

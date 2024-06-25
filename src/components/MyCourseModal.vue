<script setup>

import { defineEmits, defineProps } from 'vue'

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['closeModal'])

const closeModal = () => {
  emit('closeModal', false)
}

const getDate = (date) => {
  return new Date(date).toLocaleDateString('ru-RU');
};


</script>

<template>
  <div class="fixed z-10 inset-0 overflow-y-auto flex flex-col items-center justify-center bg-gray-500 bg-opacity-70">
    <div class="relative w-3/4 p-6 bg-white flex flex-col items-center justify-center rounded-xl">
      <button @click.prevent="closeModal"
              class="absolute top-2 right-2 text-blue-600 hover:text-blue-800 focus:outline-none">
        <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd"
                d="M10 8.586l3.293-3.293a1 1 0 011.414 1.414L11.414 10l3.293 3.293a1 1 0 01-1.414 1.414L10 11.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586 10 5.293 6.707a1 1 0 011.414-1.414L10 8.586z"
                clip-rule="evenodd" />
        </svg>
      </button>
      <div class="grid grid-cols-4 gap-y-2">
        <div class="col-span-4 mb-4">
          <p class="text-4xl font-bold text-blue-900">Информация о курсе №{{course.id}}</p>
        </div>
        <div class="col-span-4 flex flex-col">
          <strong>Наименование программы:</strong>
          <p class="text-left">{{ props.course.program_name }} <span
            v-if="props.course.cycle_commission">(ЦК: {{ props.course.cycle_commission }})</span></p>
        </div>
        <div class="col-span-2">
          <p class="flex flex-col">
            <strong>Тип курса:</strong>
            {{ props.course.type_of_education === 'ПП' ? 'Профессиональная переподготовка' : 'Повышение квалификации' }}</p>
        </div>
        <div class="col-span-2">
          <p class="flex flex-col">
            <strong>Период прохождения:</strong>
            {{ props.course.training_period }} ({{ props.course.hours }} ч.)
          </p>
        </div>
        <div class="col-span-2">
          <p class="flex flex-col">
            <strong>Город прохождения:</strong>
            {{ props.course.city }}
          </p>
        </div>
        <div class="col-span-2">
          <p class="flex flex-col">
            <strong>Место прохождения:</strong>
            {{ props.course.training_place }}
          </p>
        </div>
        <div class="col-span-2">
          <p class="flex flex-col">
            <strong>Тип документа:</strong>
            {{ props.course.document_type === 'У' ? 'Удостоверение' : 'Диплом' }}
          </p>
        </div>
        <div class="col-span-2">
          <p class="flex flex-col">
            <strong>Дата выдачи:</strong>
            {{ getDate(props.course.issue_date) }}
          </p>
        </div>
        <div class="col-span-2">
          <p class="flex flex-col">
            <strong>Номер:</strong>
            {{ props.course.certificate_number }}
          </p>
        </div>
        <div class="col-span-2">
          <p class="flex flex-col">
            <strong>Рег. номер:</strong>
            {{ props.course.registration_number }}
          </p>
        </div>
        <div v-if="props.course.qualification" class="col-span-4">
          <p class="flex flex-col">
            <strong>Квалификация:</strong>
            {{ props.course.qualification }}
          </p>
        </div>
        <div class="col-span-4 pt-2.5">
          <p class="text-lg font-normal text-blue-900">Курс {{ !course.is_processed ? "не был" : " был" }} обработан администратором</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
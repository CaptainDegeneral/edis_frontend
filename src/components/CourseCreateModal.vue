<script setup>
import { defineEmits, ref, reactive, computed, watch } from 'vue';
import InputField from '@/components/InputField.vue';
import { DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import { api } from '@/modules/axios-config.js';
import emitter from '@/modules/eventBus.js';

// Инициализация данных
const today = new Date().toISOString().split('T')[0];
const datesRange = ref({ start: today, end: today });

const formData = reactive({
  type_of_education: '',
  start_date: datesRange.value.start,
  end_date: datesRange.value.end,
  program_name: '',
  training_place: '',
  city: '',
  certificate_number: '',
  registration_number: '',
  issue_date: today,
  hours: null,
  cycle_commission: '',
  qualification: ''
});

const isLoading = ref(false);
const loadingResponse = ref();

const mask = ref({ modelValue: 'YYYY-MM-DD' });

const emit = defineEmits(['closeModal']);

// Вычисляемые свойства для меток
const documentLabel = computed(() => formData.type_of_education === 'ПП' ? 'Номер диплома:' : formData.type_of_education === 'ПК' ? 'Номер удостоверения:' : 'Номер документа:');
const issueDateLabel = computed(() => formData.type_of_education === 'ПП' ? 'Дата выдачи диплома:' : formData.type_of_education === 'ПК' ? 'Дата выдачи удостоверения:' : 'Дата выдачи документа:');

// Наблюдение за изменением дат
watch(datesRange, newDates => {
  formData.start_date = newDates.start;
  formData.end_date = newDates.end;
}, { immediate: true });

watch(loadingResponse, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      loadingResponse.value = null;
    }, 2000);
  }
});

// Асинхронная функция добавления курса
const addCourse = async () => {
  isLoading.value = true;

  await api.post('/courses/', formData)
    .then((response) => {
      loadingResponse.value = response.data;
      resetFormData();
      emitter.emit('newCourseAdded');
    })
    .catch(() => {
      isLoading.value = false;
    })
    .finally(() => {
      isLoading.value = false;
    })
};

// Сброс данных формы
const resetFormData = () => {
  Object.assign(formData, {
    type_of_education: '',
    start_date: today,
    end_date: today,
    program_name: '',
    training_place: '',
    city: '',
    certificate_number: '',
    registration_number: '',
    issue_date: today,
    hours: null,
    cycle_commission: '',
    qualification: ''
  });
};

const closeModal = () => {
  emit('closeModal', false);
  loadingResponse.value = null;
  resetFormData();
};

// Отключение кнопки при отсутствии значения хотя бы в одном обязательном поле
const disableBtn = computed(() =>
  !formData.type_of_education
  || !formData.program_name
  || !formData.training_place
  || !formData.city
  || !formData.certificate_number
  || !formData.registration_number
  || !formData.hours
);

</script>

<template>
  <div class="fixed z-10 inset-0 overflow-y-auto flex flex-col items-center justify-center bg-gray-500 bg-opacity-70">
    <div class="relative w-3/4 p-6 bg-white flex flex-col items-center justify-center rounded-xl">
      <button @click.prevent="closeModal" :disabled="isLoading" class="absolute top-2 right-2 text-blue-600 hover:text-blue-800 focus:outline-none">
        <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 8.586l3.293-3.293a1 1 0 011.414 1.414L11.414 10l3.293 3.293a1 1 0 01-1.414 1.414L10 11.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586 10 5.293 6.707a1 1 0 011.414-1.414L10 8.586z" clip-rule="evenodd"/>
        </svg>
      </button>
      <form class="w-full grid grid-cols-2 gap-6 items-end">
        <div class="col-span-2">
          <p class="text-4xl font-bold text-blue-900">Новый курс</p>
        </div>
        <div class="col-span-2">
          <input-field
            v-model:value.trim="formData.program_name"
            :value="formData.program_name"
            :required="true"
            :disabled="isLoading"
            label="Название программы:"
            source="courses"
          />
        </div>
        <div class="w-full col-span-1">
          <DatePicker
            v-model.range.string="datesRange"
            :masks="mask"
            is-required
            :disabled="isLoading"
          >
            <template #default="{ inputValue, inputEvents }">
              <div class="w-full grid grid-cols-[1fr,1fr,auto] gap-x-6">
                <input-field label="Дата начала:" source="courses" :value="inputValue.start" v-on="inputEvents.start" :disabled="isLoading"></input-field>
                <input-field label="Дата окончания:" source="courses" :value="inputValue.end" v-on="inputEvents.end" :disabled="isLoading"></input-field>
                <div class="w-16">
                  <input-field
                    v-model:value.number.trim="formData.hours"
                    :value="formData.hours"
                    label="Часы:"
                    :disabled="isLoading"
                    source="courses"
                  />
                </div>
              </div>
            </template>
          </DatePicker>
        </div>
        <div>
          <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Тип образования:</label>
          <select
            v-model="formData.type_of_education"
            :required="true"
            id="countries"
            :disabled="isLoading"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option disabled value="">Выберите...</option>
            <option value="ПП">Профессиональная переподготовка</option>
            <option value="ПК">Повышение квалификации</option>
          </select>
        </div>
        <div>
          <input-field
            v-model:value.trim="formData.city"
            :value="formData.city"
            :required="true"
            :disabled="isLoading"
            label="Город прохождения:"
            source="courses"
          />
        </div>
        <div>
          <input-field
            v-model:value.trim="formData.training_place"
            :value="formData.training_place"
            :required="true"
            :disabled="isLoading"
            label="Место прохождения:"
            source="courses"
          />
        </div>
        <div class="col-span-2 grid grid-cols-3 gap-6">
          <div>
            <input-field
              v-model:value.trim="formData.certificate_number"
              :value="formData.certificate_number"
              :required="true"
              :disabled="isLoading"
              :label="documentLabel"
              source="courses"
            />
          </div>
          <div>
            <input-field
              v-model:value.trim="formData.registration_number"
              :value="formData.registration_number"
              :required="true"
              :disabled="isLoading"
              label="Регистрационный номер:"
              source="courses"
            />
          </div>
          <div>
            <DatePicker
              v-model.string="formData.issue_date"
              :masks="mask"
              mode="date"
              is-required
              :disabled="isLoading"
            >
              <template #default="{ inputValue, inputEvents }">
                <InputField source="courses" :value="inputValue" v-on="inputEvents" :label="issueDateLabel" :disabled="isLoading"/>
              </template>
            </DatePicker>
          </div>
        </div>
        <div>
          <input-field
            v-model:value.trim="formData.cycle_commission"
            :value="formData.cycle_commission"
            :disabled="isLoading"
            label="Цикловая комиссия (необязательно):"
            source="courses"
          />
        </div>
        <div>
          <input-field
            v-model:value.trim="formData.qualification"
            :value="formData.qualification"
            :disabled="isLoading"
            label="Квалификация (необязательно):"
            source="courses"
          />
        </div>
        <div>
          <button
            @click.prevent="closeModal"
            :disabled="isLoading"
            type="button"
            class="w-full px-5 py-3 text-base font-medium text-center inline-flex items-center justify-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 disabled:bg-gray-400 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <svg class="w-6 h-6 text-white me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
              <use href="/sprite.svg#icon-cancel"></use>
            </svg>
            Отменить добавление
          </button>
        </div>
        <div>
          <button
            :disabled="disableBtn || isLoading"
            @click.prevent="addCourse"
            type="submit"
            class="w-full px-5 py-3 text-base font-medium text-center inline-flex items-center justify-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 disabled:bg-gray-400 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 group">

            <svg v-if="!loadingResponse && !isLoading" class="w-6 h-6 text-white me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
              <use href="/sprite.svg#icon-save"></use>
            </svg>

            <svg v-else-if="isLoading && !loadingResponse" aria-hidden="true" class="w-6 h-6 me-3 text-gray-400 animate-spin fill-white group-hover:text-gray-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7236 75.2124 7.55345C69.5422 4.3833 63.2754 2.51563 56.7688 2.05027C51.7666 1.6869 46.6976 2.00988 41.7345 3.0009C39.2611 3.49746 37.813 5.98566 38.4501 8.41114C39.0873 10.8366 41.5605 12.2688 44.0652 11.8376C47.872 11.1631 51.7613 11.093 55.5413 11.608C60.7024 12.2866 65.6482 14.1341 70.0346 17.0456C74.421 19.9571 78.1433 23.8695 80.9427 28.5257C83.2171 32.1422 84.9117 36.114 85.9532 40.2784C86.596 42.6352 89.5423 43.9081 91.9676 43.2709Z" fill="currentFill"/>
            </svg>

            <span v-if="!loadingResponse && !isLoading">Добавить курс</span>
            <span v-else-if="loadingResponse && !isLoading">Добавление...</span>
            <span v-else>Подождите...</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
</style>
<script setup>
import { ref, defineProps, watch, computed } from 'vue';

const props = defineProps({
  errors: {
    type: Number,
    required: true
  },
  firstNameErrors: {
    type: Array,
    required: true
  },
  lastNameErrors: {
    type: Array,
    required: true
  },
  emailErrors: {
    type: Array,
    required: true
  },
  passwordErrors: {
    type: Array,
    required: true
  },
  confirmPasswordErrors: {
    type: Array,
    required: true
  },
  isPasswordUpdating: {
    type: Boolean,
    required: false,
    default: true
  },
});

const checkPasswordErrors = computed(() => {
  return props.isPasswordUpdating ? props.passwordErrors : [];
});

const checkConfirmPasswordErrors = computed(() => {
  return props.isPasswordUpdating ? props.confirmPasswordErrors : [];
});

const combinedErrors = computed(() => {
  return [
    ...props.firstNameErrors,
    ...props.lastNameErrors,
    ...props.emailErrors,
    ...checkPasswordErrors.value,
    ...checkConfirmPasswordErrors.value
  ];
});

const isDisplayed = ref(combinedErrors.value.length > 0);

const closeAlert = () => {
  isDisplayed.value = false;
};

watch(combinedErrors, (newErrors) => {
  isDisplayed.value = newErrors.length > 0;
});
</script>

<template>
  <transition>
    <div v-if="isDisplayed" class="inset-0 flex items-start justify-end p-5 errors-label">
      <div class="relative">
        <div class="flex p-6 mb-4 text-sm text-red-800 bg-red-50 rounded-lg dark:bg-gray-800 dark:text-red-400" role="alert">
          <span class="sr-only">Danger</span>
          <div>
            <span class="text-base font-medium pr-6">Введенные данные не соответствуют требованиям:</span>
              <ul class="mt-1.5 list-disc list-inside">
                <transition-group>
                  <li v-for="error in props.firstNameErrors" :key="error.uid">
                    {{ error.$message }}
                  </li>
                </transition-group>
                <transition-group>
                  <li v-for="error in props.lastNameErrors" :key="error.uid">
                    {{ error.$message }}
                  </li>
                </transition-group>
                <transition-group>
                  <li v-for="error in props.emailErrors" :key="error.uid">
                    {{ error.$message }}
                  </li>
                </transition-group>
                <transition-group>
                  <li v-for="error in checkPasswordErrors" :key="error.uid">
                    {{ error.$message }}
                  </li>
                </transition-group>
                <transition-group>
                  <li v-for="error in checkConfirmPasswordErrors" :key="error.uid">
                    {{ error.$message }}
                  </li>
                </transition-group>
              </ul>
          </div>
          <button @click="closeAlert" class="absolute top-2 right-2 text-red-600 hover:text-red-800 focus:outline-none">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 8.586l3.293-3.293a1 1 0 011.414 1.414L11.414 10l3.293 3.293a1 1 0 01-1.414 1.414L10 11.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586 10 5.293 6.707a1 1 0 011.414-1.414L10 8.586z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.errors-label {
  position: absolute;
  height: max-content;
  top: -170px;
  right: -60px;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
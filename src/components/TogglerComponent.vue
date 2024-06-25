<template>
  <label :class="blockClasses">
    <input
      type="checkbox"
      class="sr-only peer"
      :disabled="disabled"
      :checked="isChecked"
      @change="updateValue"
    />
    <div :class="inputClasses"></div>
    <span :class="labelClasses">
      {{ label }}
    </span>
  </label>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch, computed } from 'vue';

const props = defineProps({
  label: { type: String, default: 'Toggle me' },
  modelValue: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue']);

const isChecked = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
  isChecked.value = newValue;
});

const updateValue = () => {
  isChecked.value = !isChecked.value;
  emit('update:modelValue', isChecked.value);
};

const labelClasses = computed(() => ({
  'ms-3 text-base font-medium text-gray-700 dark:text-gray-300': true,
  'cursor-not-allowed': props.disabled
}));

const inputClasses = computed(() => ({
  'relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600': true,
  'cursor-not-allowed': props.disabled
}));

const blockClasses = computed(() => ({
  'w-fit inline-flex items-center cursor-pointer': !props.disabled,
  'w-fit inline-flex items-center cursor-not-allowed': props.disabled
}))
</script>

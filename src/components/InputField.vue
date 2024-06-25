<template>
  <div>
    <label :for="props.id" :class="labelClasses">
      {{ props.label }}
    </label>
    <input
      :type="props.type"
      :name="props.name"
      :id="props.id"
      :placeholder="props.placeholder"
      :class="inputClasses"
      :required="props.required"
      :value="props.value"
      @input="updateValue"
      @focus="handleFocus"
      autocomplete="off"
      :disabled="props.disabled"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  type: { type: String, required: false },
  name: { type: String, required: false },
  id: { type: String, required: false },
  label: { type: String, required: false },
  placeholder: { type: String, required: false },
  required: { type: Boolean, required: false, default: false },
  value: { required: false },
  disabled: { type: Boolean, default: false },
  source: { type: String, required: false }
});

const emit = defineEmits(['update:value', 'focus']);

const updateValue = (e) => { emit('update:value', e.target.value); }

const handleFocus = () => { emit('focus'); }

const labelClasses = computed(() => ({
  'block mb-2 text-base font-medium': true,
  'text-gray-700 dark:text-white': !props.disabled || (props.disabled && props.source === 'courses'),
  'text-lg text-gray-400 font-medium': props.disabled  && !props.source
}));

const inputClasses = computed(() => ({
  'bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus-visible:outline-none focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500': true,
  'disabled:bg-transparent disabled:border-none disabled:text-2xl disabled:text-gray-600 disabled:font-medium disabled:pl-0': props.disabled && !props.source,
  'bg-gray-100 border border-gray-300 text-gray-900 text-sm cursor-not-allowed': props.disabled && props.source === 'courses'
}));

</script>

<style scoped>

</style>
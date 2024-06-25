<template>
    <button :type="props.type" :class="props.buttonClass" @click="handleClick">
        <div class="flex justify-center items-center">
            <svg v-if="props.icon" :class="props.iconClass">
                <use :xlink:href="props.icon"></use>
            </svg>
        </div>
        <span v-if="props.label" :class="props.labelClass">{{ props.label }}</span>
        <slot></slot>
    </button>
</template>

<script setup>
const props = defineProps({
    type: {
        type: String,
        default: 'button'
    },
    label: {
        type: String,
        default: ''
    },
    icon: {
        type: String,
        default: ''
    },
    buttonClass: {
        type: String,
        default: 'w-full text-blue-600 hover:text-white border border-blue-600 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-5 py-2.5 text-center items-center justify-center me-2 mb-2 mt-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 grid grid-cols-4 gap-2'
    },
    iconClass: {
        type: String,
        default: 'w-6 h-6'
    },
    labelClass: {
        type: String,
        default: 'col-span-3 text-center'
    }
});

const emit = defineEmits(['click']);

const handleClick = (event) => {
    emit('click', event);
};
</script>

<script setup>

import { defineProps } from 'vue';

const props = defineProps({
    errors: {
        type: Array,
        required: true
    }
});

</script>

<template>
    <div v-if="props.errors.length > 0" v-auto-animate>
        <div v-for="error in props.errors" :key="error.$uid" class="mb-3">
            <p class="text-sm text-red-600 mb-2">Внимание! {{ error.$message }}</p>
        </div>
    </div>
</template>

<style></style>
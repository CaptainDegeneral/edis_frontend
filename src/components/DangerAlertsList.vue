<script setup>
import { defineProps } from 'vue';

import DangerAlert from '@/components/DangerAlert.vue'

const props = defineProps({ errors: { type: Array, required: true } });
</script>

<template>
    <div v-if="props.errors.length > 0" class="h-full pt-6 absolute bottom-0 right-0 mb-4 mr-6 w-[24rem]">
        <div class="mt-1.5 list-disc list-inside" v-auto-animate>
            <DangerAlert v-for="error in props.errors" :key="error.$uid" :label="error.$message" />
        </div>
    </div>
</template>

<style scoped></style>
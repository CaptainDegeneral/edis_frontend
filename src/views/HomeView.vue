<script setup>
import pinia from '@/modules/pinia-instance';

import { useUserStore } from '@/store/user-store'
import { onMounted } from 'vue';

import DashboardComponent from '@/components/DashboardComponent.vue';

const userStore = useUserStore(pinia);

onMounted(() => { userStore.checkDataIntegrity(); })
</script>

<template>
    <dashboard-component></dashboard-component>
</template>

<style></style>
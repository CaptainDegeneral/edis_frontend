<script setup>

import UProfile from '@/components/UProfileSectionPart.vue'
import SProfile from '@/components/SProfileSectionPart.vue'

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

</script>

<template>

  <u-profile
    v-if="!props.user.is_staff"
    :user="props.user">
  </u-profile>

  <s-profile
    v-else
    :user="props.user">
  </s-profile>

</template>

<style scoped>

</style>
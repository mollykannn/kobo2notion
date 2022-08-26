<script setup>
defineProps({
  options: Array,
  modelValue: {
    type: [String, Number],
    default: '',
  },
  updateValue: Function,
})
</script>

<template>
  <n-select v-model="modelValue" :value="modelValue" v-bind="{ onUpdateValue: updateValue }" :options="options" />
</template>

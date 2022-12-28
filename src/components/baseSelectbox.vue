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
  <n-select :value="modelValue" v-bind="{ onUpdateValue: updateValue }" :options="options" />
</template>

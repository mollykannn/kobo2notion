<script setup>
defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: '',
  },
  updateValue: Function,
  disabled: Boolean
})
</script>

<template>
  <NInput
    v-bind="{ onInput: updateValue }"
    :value="modelValue"
    class="flex-1"
    :disabled="disabled"
  />
</template>

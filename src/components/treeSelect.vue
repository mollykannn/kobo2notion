<script setup>
const props = defineProps({
  options: Array,
  modelValue: {
    type: [String, Number, Boolean, Array],
    default: '',
  },
  updateValue: Function,
  selectAll: Boolean,
  loading: Boolean,
})

const treeCategory = (data, [array, disArray]) => {
  data.forEach(e => {
    e.disabled && disArray.push(e.key)
    array.push(e.key)
    e.children && treeCategory(e.children, [array, disArray])
  })
  return {
    all: array,
    disabled: disArray,
  }
}
let treeSelect = treeCategory(props.options, [[], []])

const data = reactive({
  selectedID: props.modelValue,
  selectAllRef: false,
  selectAll: computed({
    get: () => data.selectAllRef,
    set: val => {
      data.selectAllRef = val
      data.selectedID = val ? treeSelect.all : treeSelect.disabled
      props.updateValue(data.selectedID)
    },
  }),
  updateCheckedKeys: v => {
    data.selectedID = v
    data.selectAllRef = treeSelect.all.length == data.selectedID.length
    props.updateValue(v)
  },
})
if (props.selectAll) {
  data.selectAll = true // Ready All
} else {
  data.selectAllRef = treeSelect.all.length == data.selectedID.length
}
</script>

<template>
  <div class="w-full">
    <div class="all">
      <n-checkbox v-model:checked="data.selectAll">所有</n-checkbox>
    </div>
    <div class="treeDetails">
      <NTree
        checkable
        default-expand-all
        :data="options"
        :default-checked-keys="modelValue"
        :checked-keys="modelValue"
        @update:checked-keys="data.updateCheckedKeys"
        :disabled="loading"
      />
    </div>
  </div>
</template>
<style>
.treeDetails .all {
  margin-top: 0.7rem;
}
</style>

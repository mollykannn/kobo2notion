<script setup>

const AsyncSelectbox = defineAsyncComponent(() => import('./baseSelectbox.vue'))
const AsyncText = defineAsyncComponent(() => import('./baseText.vue'))
const AsyncTreeSelect = defineAsyncComponent(() => import('./treeSelect.vue'))

const props = defineProps({
  columns: Object,
  data: Object,
  submitLoading: Boolean,
  Submit: Function,
})

const basicFrom = ref(null)
const updateValue = e => {
  e.preventDefault()
  basicFrom.value?.validate(errors => {
    !errors && props.Submit()
  })
}

let rules = props.columns.filter(e => !isNullOrWhitespace(e.valid))
rules = rules.reduce((oldVal, newVal) => {
  oldVal[newVal.name] = newVal.valid.map(e => {
    let object = {
      trigger: ['input', 'blur'],
    }
    if (e == 'required') {
      object.required = true
      let data = props.columns.find(e => e.name == newVal.name)
      if (data.type == 'number') object.type = data.type
      object.message = data.label ? `Please enter ${data.label}` : data.placeholder
    } else if (typeof e == 'object') {
      object.validator = e.validator
      object.message = e.message
    }
    return object
  })
  return oldVal
}, {})
</script>

<template>
  <n-form class="basicFrom" ref="basicFrom" :model="data" label-placement="top" :rules="rules" label-width="auto" :disabled="submitLoading">
    <n-grid cols="1 s:12 m:12 l:12 xl:12" :x-gap="0" responsive="screen">
      <template v-for="column in columns" :key="column.name">
        <n-form-item-gi :span="12" v-if="!column.hidden && column.tips" :show-label="false" class="label">
          <span class="iconColumn" @click="column.tips">{{ column.label }}<i class='icon'></i></span>
        </n-form-item-gi>
        <n-form-item-gi
          :label="column.label"
          :show-label="column.label && !column.tips"
          :path="column.name"
          v-if="!column.hidden"
          :span="column.span ?? 12"
          :class="column.class"
        >
          <template v-if="column.type == 'text'">
            <AsyncText v-model="data[column.name]" :updateValue="val => (data[column.name] = val)" :disabled="column?.disabled" />
          </template>
          <template v-else-if="column.type == 'selectbox'">
            <AsyncSelectbox v-model="data[column.name]" :updateValue="val => (data[column.name] = val)" :options="column.options" />
          </template>
          <template v-else-if="['treeSelect'].includes(column.type)">
            <AsyncTreeSelect
              v-model="data[column.name]"
              :options="column.options"
              :selectAll="column.selectAll"
              :updateValue="val => (data[column.name] = val)"
              :loading="submitLoading"
            />
          </template>
        </n-form-item-gi>
      </template>
    </n-grid>
    <n-button type="primary" attr-type="submit" :loading="submitLoading" @click="updateValue" class="w-full"> Export </n-button>
  </n-form>
</template>
<style>
.basicFrom .label .n-form-item-feedback-wrapper {
  display: none;
}
.iconColumn {
  display: flex;
  align-items: center;
}
.icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-left: .5rem;
  background-color: #18a058;
  cursor: pointer;
  -webkit-mask-size: cover;
  mask-size: cover;
  -webkit-mask-image: url(@/assets/images/HelpCircle.svg);
  mask-image: url(@/assets/images/HelpCircle.svg);
}
</style>
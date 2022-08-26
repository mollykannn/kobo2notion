<template>
  <div class="container">
    <div class="switch-column">
      <label class="switch">
        <input type="checkbox" v-on:click="setting.isDark = !setting.isDark" :checked="setting.isDark" />
        <span class="slider"></span>
      </label>
    </div>
    <h1 class="title mb-12">Kobo2Notion</h1>
    <div class="file mb-12">
      <div class="file-upload" v-on:click.prevent="$refs.fileInput.click()" v-on:dragover.prevent v-on:drop.prevent="setting.importFile">
        {{ setting.fileName }}
      </div>
      <input type="file" ref="fileInput" class="hidden" @change="setting.importFile" />
      <span class="small"
        >* Connect your kobo reader to a computer. You can find .kobo directory (hidden by default). There should be a KoboReader.sqlite file. Drop a
        file here.</span
      >
    </div>
    <div class="content mb-24" v-if="bookListData.content.length > 0">
      <div class="export-setting">
        <baseForm :columns="formColumnEdit" :data="formData" :Submit="Submit" :submitLoading="loading" />
      </div>
    </div>
    <footer class="footer">
      Created by
      <a href="https://github.com/mollykannn">Molly Kan</a>
      / Retrieved from <a href="http://www.vixual.net/blog/archives/117">Kobo Exporter: 匯出 Kobo 電子書的書籍清單與註記資料 (劃線與筆記) | Vixual</a>
      <br />
      Icons made by <a href="http://www.freepik.com/" title="Freepik">Freepik</a> from
      <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
    </footer>
  </div>
  <AsyncPopup :open="modalSetting.open" :action="modalSetting.action"/>
</template>

<script setup>
import initSqlJs from 'sql.js'
import { useNotification } from 'naive-ui'
const notification = useNotification()
const AsyncPopup = defineAsyncComponent(() => import('../components/popup.vue'))

const modalSetting = reactive({
  open: false,
  action: 'Token',
  changeAction: computed({
    get: () => modalSetting.action,
    set: val => {
      modalSetting.action = val
      modalSetting.open = true
    },
  }),
})

const setting = reactive({
  isDark: useMode(),
  fileName: 'Drop your .sqlite file here',
  dbData: '',
  importFile: e => {
    const [files] = e.target.files || e.dataTransfer.files
    setting.fileName = files.name
    const fileReader = new FileReader()
    fileReader.onload = async () => {
      let SQL = await initSqlJs()
      const db = new SQL.Database(new Uint8Array(fileReader.result))
      setting.dbData = db
      bookListData.Get()
    }
    fileReader.readAsArrayBuffer(files)
  },
})

const bookListData = reactive({
  content: '',
  treeSelect: [],
  Get: () => {
    const [res] = setting.dbData.exec(BookListSQL)
    bookListData.content = res.values.map(element => element.reduce((old, curr, index) => ((old[res.columns[index]] = curr), old), {}))
    bookListData.treeSelect = res.values.map(element => ({
      label: element[res.columns.findIndex(x => x === 'BookTitle')],
      key: element[res.columns.findIndex(x => x === 'ContentID')],
      disabled: false,
    }))
  },
})

const formColumnEdit = computed(() => [
  {
    label: 'Action',
    type: 'selectbox',
    name: 'action',
    options: [
      { label: 'Create', value: 'Create' },
      { label: 'Update', value: 'Update' },
    ],
  },
  {
    label: 'Notion Token',
    type: 'text',
    name: 'token',
    valid: ['required'],
    tips: () => {
      modalSetting.changeAction = 'Token'
    },
  },
  {
    label: 'Database ID',
    type: 'text',
    name: 'database_id',
    hidden: formData.action === 'Create',
    valid: ['required'],
    tips: () => {
      modalSetting.changeAction = 'ID'
    },
  },
  {
    label: 'Page ID',
    type: 'text',
    name: 'page_id',
    hidden: formData.action === 'Update',
    valid: ['required'],
    tips: () => {
      modalSetting.changeAction = 'ID'
    },
  },
  { label: 'Book Title', type: 'treeSelect', name: 'allow', options: bookListData.treeSelect, selectAll: true, class: 'bookTitle' },
])
let formData = reactive({
  token: '',
  action: 'Create',
  database_id: '',
  page_id: '',
  allow: [],
})

const GetMessage = (message, type = 'error') => {
  notification[type]({
    content: message,
    duration: 2000,
  })
  loading.value = false
}

const { loading, Submit } = NotionSetting(setting, bookListData, formData, GetMessage)
</script>

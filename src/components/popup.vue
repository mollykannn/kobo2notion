<script setup>
defineProps({
  open: Boolean,
  action: String,
})
</script>

<template>
  <n-modal v-model:show="open">
    <n-card
      class="max-w-600px"
      :title="action === 'Token' ? 'How to Get your Token?' : 'How to Get your Pages/Databases ID?'"
      :closable="true"
      :on-close="
        () => {
          open = !open
        }
      "
    >
      <div v-if="action === 'Token'">
        <p>1) Go to <a href="https://www.notion.so/my-integrations">My integrations page</a> on the Notion website</p>
        <p>2) Create a new integrations</p>
        <br />
        <p>* Make sure your token have access right to your Pages/Databases</p>
        <img src="@/assets/images/step-2.png" class="max-w-full" />
      </div>
      <div v-else-if="action === 'ID'">
        <p>1) Copy your Pages/Databases link</p>
        <img src="@/assets/images/step-1.png" class="max-w-full" />
        <p>2) The URL should be like: https://www.notion.so/{Page Name}-{Pages/Databases ID}, the last 32 character is your Pages/Databases ID</p>
        <br />
        <p>* Make sure your token have access right to your Pages/Databases</p>
        <img src="@/assets/images/step-2.png" class="max-w-full" />
      </div>
    </n-card>
  </n-modal>
</template>

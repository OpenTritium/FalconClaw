<template>
<div flex="~ col" font-sans bg="grey-50" class="app-container">
  <header flex="~ items-center justify-between shrink-0" p="x-4 y-2" bg="gray-100" border="b gray-200">
    <h1 text="lg gray-800" font="bold">{{ t('downloadManager') }}</h1>
    <button i-mdi-cog-outline text="xl gray-600" hover:opacity="75" :title="t('settings')" />
  </header>
  <div>
    <main>
      <section p="x-4 y-3">
        <h2 font="semibold" text="md gray-700" mb="3">{{ t('inProgress') }}</h2>
        <div v-if="activeTasks.length > 0">
          <ActiveItem v-for="task in activeTasks" :key="task.id" :task="task" @resume="tasks.resumeTask"
            @pause="tasks.pauseTask" @cancel="tasks.cancelTask" />
        </div>
        <div v-else class="empty-placeholder" text-center p="y-4" text="sm gray-500">{{ t('noDownloadTasks') }}</div>
      </section>
    </main>
    <div v-if="finishedTasks.length > 0">
      <hr border="t gray-200" my="2" />
      <section p="x-4 y-3">
        <h2 font="semibold" text="md gray-700" mb="3">{{ t('completed') }}</h2>
        <div>
          <DeactiveItem v-for="task in finishedTasks" :key="task.id" :task="task" @open-file="tasks.openFile"
            @open-folder="tasks.openFolder" @remove-record="tasks.removeRecord" @retry="tasks.resumeTask"
            @remove-file-and-record="tasks.removeFileAndRecord" />
        </div>
      </section>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import ActiveItem from '@/components/ActiveItem.vue'
import DeactiveItem from '@/components/DeactiveItem.vue'
import { i18n } from '#i18n'
import { useTaskStore } from '@/stores/tasks'
import { storeToRefs } from 'pinia'

let { t } = i18n

const tasks = useTaskStore()
const { active: activeTasks, deactive: finishedTasks } = storeToRefs(tasks)
</script>

<style scoped>
.app-container {
  min-width: 400px;
  max-width: 400px;
  min-height: 400px;
  max-height: 800px;
}
</style>

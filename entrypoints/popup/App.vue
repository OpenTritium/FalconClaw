<template>
<div w="full" h-screen flex="~ col" font-sans bg-gray-50>
  <header flex="~ items-center justify-between shrink-0" p="x-4 y-2" bg="gray-100" border="b gray-200">
    <h1 text="lg gray-800" font="bold">下载管理器</h1>
    <button i-mdi-cog-outline text="xl gray-600" hover:opacity="75" title="设置" />
  </header>
  <main flex="1" overflow-y="auto">
    <section p="x-4 y-3">
      <h2 font="semibold" text="md gray-700" mb="3">进行中</h2>
      <div v-if="activeTasks.length > 0">
        <ActiveItem v-for="task in activeTasks" :key="task.id" :task="task" @resume="handleResume" @pause="handlePause"
          @cancel="handleCancel" />
      </div>
      <div v-else class="empty-placeholder" text-center p="y-4" text="sm gray-500">暂无下载任务</div>
    </section>
    <hr border="t gray-200" my="2" />
    <section p="x-4 y-3">
      <h2 font="semibold" text="md gray-700" mb="3">已完成</h2>
      <div v-if="finishedTasks.length > 0">
        <DeactiveItem v-for="task in finishedTasks" :key="task.id" :task="task" @open-file="handleOpenFile"
          @open-folder="handleOpenFolder" @remove-record="handleRemoveRecord" @retry="handleRetry"
          @remove-file-and-record="handleRemoveFileAndRecord" />
      </div>
      <div v-else class="empty-placeholder" text-center p="y-4" text="sm gray-500">暂无已完成的任务</div>
    </section>
  </main>
</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ActiveItem from '@/components/ActiveItem.vue'
import DeactiveItem from '@/components/DeactiveItem.vue'
import { type TaskInfo, TaskStatus, type TaskId } from '@/types'

// onMounted(() => {
//   document.body.style.minWidth = '500px'
//   document.body.style.minHeight = '400px'
// })

// Mock 数据，用于演示
const tasks = ref<TaskInfo[]>([
  // 下载中
  {
    id: 1,
    name: 'archlinux-2023.11.01-x86_64.iso',
    size: 914856640,
    status: TaskStatus.RUNNING,
    downloaded: 457428320,
  },
  // 暂停中
  { id: 2, name: 'vue-devtools-6.5.0.crx', size: 2306867, status: TaskStatus.PAUSED, downloaded: 922746 },
  // 已完成
  { id: 3, name: 'pretty-bytes-v10.0.0.zip', size: 1258291, status: TaskStatus.COMPLETED },
  // 失败
  {
    id: 4,
    name: 'ubuntu-22.04.3-desktop-amd64.iso',
    size: 5153960755,
    status: TaskStatus.FAILED,
    downloaded: 1030792151,
    last_error: '网络连接已中断',
  },
  // 已取消
  { id: 5, name: 'node-v20.9.0-win-x64.zip', size: 31457280, status: TaskStatus.CANCELLED },
])

const activeTasks = computed(() =>
  tasks.value.filter(task =>
    task.status === TaskStatus.RUNNING || task.status === TaskStatus.PAUSED
  )
)

const finishedTasks = computed(() =>
  tasks.value.filter(task =>
    task.status === TaskStatus.COMPLETED || task.status === TaskStatus.FAILED || task.status === TaskStatus.CANCELLED
  )
)

const handleResume = (id: TaskId) => {
  console.log(`恢复任务 #${id}`)
  const task = tasks.value.find(t => t.id === id)
  if (task) {
    task.status = TaskStatus.RUNNING
  }
}

const handlePause = (id: TaskId) => {
  console.log(`暂停任务 #${id}`)
  const task = tasks.value.find(t => t.id === id)
  if (task) {
    task.status = TaskStatus.PAUSED
  }
}

const handleCancel = (id: TaskId) => {
  console.log(`取消任务 #${id}`)
  const task = tasks.value.find(t => t.id === id)
  if (task) {
    task.status = TaskStatus.CANCELLED
  }
}

const handleOpenFile = (id: TaskId) => {
  console.log(`打开文件 #${id}`)
}

const handleOpenFolder = (id: TaskId) => {
  console.log(`打开任务 #${id} 所在文件夹`)
}

const handleRemoveRecord = (id: TaskId) => {
  console.log(`移除记录 #${id}`)
  tasks.value = tasks.value.filter(t => t.id !== id)
}

const handleRetry = (id: TaskId) => {
  console.log(`重试任务 #${id}`)
  const task = tasks.value.find(t => t.id === id)
  if (task) {
    // @ts-ignore
    task.status = TaskStatus.RUNNING
    // @ts-ignore
    task.downloaded = 0 // 实际场景可能需要保留已下载部分
    // @ts-ignore
    delete task.last_error
  }
}

const handleRemoveFileAndRecord = (id: TaskId) => {
  console.log(`删除文件和记录 #${id}`)
  tasks.value = tasks.value.filter(t => t.id !== id)
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>

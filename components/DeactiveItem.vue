<template>
  <div class="completed-task-item" h="12" relative mb="2" rounded="lg" flex items-center p="x-3" border="~ gray-200">
    <div :class="statusAppearance.icon" text="xl" mr="3" :style="{ color: statusAppearance.color }"></div>
    <div flex="1">
      <div text="sm" font="medium" truncate>{{ task.name }}</div>
      <div v-if="statusInfo" text="xs" opacity="60" truncate :title="statusInfo">{{ statusInfo }}</div>
    </div>

    <div flex gap="2">
      <template v-if="task.status === TaskStatus.COMPLETED">
        <button
          @click="emit('open-file', task.id)"
          i-mdi-file-outline
          text="lg"
          hover:opacity="75"
          title="打开文件"></button>
        <button
          @click="emit('open-folder', task.id)"
          i-mdi-folder-outline
          text="lg"
          hover:opacity="75"
          title="打开所在文件夹"></button>
        <button
          @click="emit('remove-record', task.id)"
          i-mdi-delete-outline
          text="lg"
          hover:opacity="75"
          title="移除记录"></button>
      </template>

      <template v-if="task.status === TaskStatus.FAILED">
        <button @click="emit('retry', task.id)" i-mdi-reload text="lg" hover:opacity="75" title="重试"></button>
        <button
          @click="emit('remove-file-and-record', task.id)"
          i-mdi-delete-forever-outline
          text="lg"
          hover:opacity="75"
          title="删除文件和记录"></button>
      </template>

      <template v-if="task.status === TaskStatus.CANCELLED">
        <button
          @click="emit('remove-file-and-record', task.id)"
          i-mdi-delete-forever-outline
          text="lg"
          hover:opacity="75"
          title="删除文件和记录"></button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type Task, type TaskId, TaskStatus } from '@/types'
import prettyBytes from 'pretty-bytes'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  (e: 'open-file', id: TaskId): void
  (e: 'open-folder', id: TaskId): void
  (e: 'remove-record', id: TaskId): void
  (e: 'retry', id: TaskId): void
  (e: 'remove-file-and-record', id: TaskId): void
}>()

const statusAppearance = computed(() => {
  switch (props.task.status) {
    case TaskStatus.COMPLETED:
      return { icon: 'i-mdi-check-circle-outline', color: '#4ade80' }
    case TaskStatus.FAILED:
      return { icon: 'i-mdi-alert-circle-outline', color: '#f87171' }
    case TaskStatus.CANCELLED:
      return { icon: 'i-mdi-close-circle-outline', color: '#9ca3af' }
    default:
      return { icon: '', color: '' }
  }
})

const statusInfo = computed(() => {
  const { task } = props
  switch (task.status) {
    case TaskStatus.COMPLETED:
      return task.size ? prettyBytes(task.size) : '完成'
    case TaskStatus.FAILED:
      return 'last_error' in task ? task.last_error : '未知错误'
    case TaskStatus.CANCELLED:
      return '任务已取消'
    default:
      return ''
  }
})
</script>

<style scoped>
.completed-task-item {
  background-color: #fff;
  transition: all 0.2s ease;
}

.completed-task-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>

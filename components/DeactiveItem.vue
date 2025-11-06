<template>
<div h="12" relative mb="2" rounded="lg" flex="~ items-center" p="x-3" border="~ gray-200" bg-white
  transition="all duration-200 ease" hover="translate-y--1px shadow-md">
  <div text="xl" mr="3" :class="[statusStyle.icon, statusStyle.colorClass]" />
  <div flex="1" min-w-0>
    <div text="sm" font="medium" truncate>{{ task.name }}</div>
    <div v-if="statusInfo" text="xs gray-500" truncate :title="statusInfo">{{ statusInfo }}</div>
  </div>
  <div flex="~ gap-2">
    <template v-if="task.status === TaskStatus.COMPLETED">
      <button @click="emit('open-file', task.id)" i-mdi-file-outline btn-action title="打开文件" />
      <button @click="emit('open-folder', task.id)" i-mdi-folder-outline btn-action title="打开所在文件夹" />
      <button @click="emit('remove-record', task.id)" i-mdi-delete-outline btn-action title="移除记录" />
    </template>
    <template v-if="task.status === TaskStatus.FAILED">
      <button @click="emit('retry', task.id)" i-mdi-reload btn-action title="重试" />
      <button @click="emit('remove-file-and-record', task.id)" i-mdi-delete-forever-outline btn-action
        title="删除文件和记录" />
    </template>
    <template v-if="task.status === TaskStatus.CANCELLED">
      <button @click="emit('remove-file-and-record', task.id)" i-mdi-delete-forever-outline btn-action
        title="删除文件和记录" />
    </template>
  </div>
</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type TaskInfo, type TaskId, TaskStatus } from '@/types'
import prettyBytes from 'pretty-bytes'
import { match, P } from 'ts-pattern';

const props = defineProps<{
  task: TaskInfo
}>()

const emit = defineEmits<{
  (e: 'open-file', id: TaskId): void
  (e: 'open-folder', id: TaskId): void
  (e: 'remove-record', id: TaskId): void
  (e: 'retry', id: TaskId): void
  (e: 'remove-file-and-record', id: TaskId): void
}>()


const statusStyle = computed(() =>
  match(props.task.status)
    .with(TaskStatus.COMPLETED, () => ({
      icon: 'i-mdi-check-circle-outline',
      colorClass: 'text-status-completed',
    }))
    .with(TaskStatus.FAILED, () => ({
      icon: 'i-mdi-alert-circle-outline',
      colorClass: 'text-status-failed',
    }))
    .with(TaskStatus.CANCELLED, () => ({
      icon: 'i-mdi-close-circle-outline',
      colorClass: 'text-status-cancelled',
    }))
    .otherwise(() => ({ icon: null, colorClass: null }))
)

const statusInfo = computed(() =>
  match(props.task)
    .with(
      { status: TaskStatus.COMPLETED, size: P.select(P.number.gt(0)) },
      (size) => prettyBytes(size)
    )
    .with({ status: TaskStatus.COMPLETED }, () => '完成')
    .with(
      { status: TaskStatus.FAILED },
      (task) => task.last_error
    )
    .with({ status: TaskStatus.CANCELLED }, () => '任务已取消')
    .otherwise(() => null)
);
</script>

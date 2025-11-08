<template>
  <div
    h="12"
    relative
    mb="2"
    rounded="lg"
    border="~ gray-200"
    bg-white
    transition="all duration-200 ease"
    hover="translate-y--1px shadow-md">
    <div absolute inset-0 rounded-lg overflow-hidden z="0" bg="gray-100">
      <div
        class="progress-fill"
        absolute
        top-0
        left-0
        h-full
        transition="all 0.3s ease"
        :class="progressBarColor"
        :style="{ width: progressStr }">
        <div v-if="props.task.status === TaskStatus.RUNNING" class="progress-shine" absolute inset-0 animate-shine />
      </div>
    </div>
    <div relative flex="~ items-center" h-full p="x-3" z="10">
      <div flex="1" text="sm" font="medium" truncate min-w-0>{{ task.name }}</div>
      <div v-if="sizeInfo" text="xs gray-600" mr="2">{{ sizeInfo }}</div>
      <div text="xs gray-600" mr="2">{{ progressStr }}</div>
      <div flex="~ gap-2">
        <button
          v-if="task.status === TaskStatus.PAUSED"
          @click="emit('resume', task.id)"
          i-mdi-play-circle-outline
          btn-action
          :title="t('resume')" />
        <button v-else @click="emit('pause', task.id)" i-mdi-pause-circle-outline btn-action :title="t('pause')" />
        <button @click="emit('cancel', task.id)" i-mdi-close-circle-outline btn-action :title="t('cancel')" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type TaskInfo, type TaskId, TaskStatus, progress_in_percentage } from '@/types/task'
import prettyBytes from 'pretty-bytes'
import { match, P } from 'ts-pattern'
import { i18n } from '#i18n'

const { t } = i18n

const props = defineProps<{
  task: TaskInfo
}>()

const emit = defineEmits<{
  (e: 'resume', id: TaskId): void
  (e: 'pause', id: TaskId): void
  (e: 'cancel', id: TaskId): void
}>()

const progressStr = computed(() => `${progress_in_percentage(props.task)}%`)

const progressBarColor = computed(() =>
  match(props.task.status)
    .with(TaskStatus.RUNNING, () => 'bg-progress-running')
    .with(TaskStatus.PAUSED, () => 'bg-progress-paused')
    .with(TaskStatus.COMPLETED, () => 'bg-progress-completed')
    .otherwise(() => 'bg-transparent')
)

const sizeInfo = computed(() =>
  match(props.task)
    .with(
      { status: P.union(TaskStatus.RUNNING, TaskStatus.PAUSED, TaskStatus.FAILED), size: P.number.gt(0) },
      t => `${prettyBytes(t.downloaded)} / ${prettyBytes(t.size)}`
    )
    .with({ status: P.union(TaskStatus.RUNNING, TaskStatus.PAUSED, TaskStatus.FAILED) }, t => prettyBytes(t.downloaded))
    .with({ status: TaskStatus.COMPLETED, size: P.number.gt(0) }, t => prettyBytes(t.size))
    .otherwise(() => null)
)
</script>

<style scoped>
.progress-fill {
  opacity: 0.95;
}

.progress-shine {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0) 100%
  );
}
</style>

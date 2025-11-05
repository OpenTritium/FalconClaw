<template>
  <div class="download-item" h="12" relative mb="2" rounded="lg" border="~ gray-200">
    <div class="progress-bg" absolute inset-0 rounded="lg" overflow="hidden" z="0">
      <div
        class="progress-fill"
        absolute
        top-0
        left-0
        h-full
        :style="{ width: progressStr }"
        :class="progressClass"
        transition="all 0.3s ease">
        <div 
          class="progress-shine" 
          absolute 
          inset-0 
          :class="{ 'animate-shine': isAnimating }"
          :style="{ opacity: shineOpacity }"></div>
      </div>
    </div>

    <!-- 内容层 -->
    <div relative flex items-center h-full p="x-3" z="10">
      <div flex="1" text="sm" font="medium" truncate>{{ task.name }}</div>
      <div v-if="sizeStr" text="xs" opacity="75" mr="2">{{ sizeStr }}</div>
      <div text="xs" opacity="75" mr="2">{{ progressStr }}</div>
      <div flex gap="2">
        <button
          v-if="task.status === TaskStatus.PAUSED"
          @click="emit(CommandName.RESUME, task.id)"
          i-mdi-play-circle-outline
          text="lg"
          hover:opacity="75"></button>
        <button
          v-else
          @click="emit(CommandName.PAUSE, task.id)"
          i-mdi-pause-circle-outline
          text="lg"
          hover:opacity="75"></button>
        <button
          @click="emit(CommandName.CANCEL, task.id)"
          i-mdi-close-circle-outline
          text="lg"
          hover:opacity="75"></button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type Task, TaskStatus, CommandName, progress_in_percentage, TaskId } from '@/types'
import prettyBytes from 'pretty-bytes'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  (e: typeof CommandName.RESUME, id: TaskId): void
  (e: typeof CommandName.PAUSE, id: TaskId): void
  (e: typeof CommandName.CANCEL, id: TaskId): void
}>()

// [优化1] 新增计算属性，判断任务是否正在进行
const isAnimating = computed(() => props.task.status === TaskStatus.RUNNING)

const progressStr = computed(() => `${progress_in_percentage(props.task)}%`)

const progressClass = computed(() => {
  switch (props.task.status) {
    case TaskStatus.RUNNING:
      return 'progress-running'
    case TaskStatus.PAUSED:
      return 'progress-paused'
    default:
      return 'progress-default'
  }
})

const shineOpacity = computed(() => {
  switch (props.task.status) {
    case TaskStatus.PAUSED:
      return 0
    default:
      return 1
  }
})

const sizeStr = computed(() => {
  const { task } = props
  if (task.status === TaskStatus.RUNNING || task.status === TaskStatus.PAUSED || task.status === TaskStatus.FAILED) {
    const downloadedFormatted = prettyBytes(task.downloaded)
    if (task.size && task.size > 0) {
      const sizeFormatted = prettyBytes(task.size)
      return `${downloadedFormatted} / ${sizeFormatted}`
    }
    return downloadedFormatted
  }
  if (task.status === TaskStatus.COMPLETED && task.size) {
    return prettyBytes(task.size)
  }
  return null
})
</script>

<style scoped>
.download-item {
  transition: all 0.2s ease;
  background-color: #fff;
}

.download-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.progress-bg {
  background-color: #f3f4f6;
}

.progress-fill {
  opacity: 0.95;
  position: relative;
  overflow: hidden;
}

.progress-running {
  background: linear-gradient(90deg, #60a5fa, #3b82f6);
}

.progress-paused {
  background: #f97316;
}

.progress-default {
  background: linear-gradient(90deg, #4ade80, #16a34a);
}

.progress-shine {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0) 100%
  );
}

@keyframes shine-moving {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shine {
  animation: shine-moving 2s linear infinite;
}
</style>
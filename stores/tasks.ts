import { defineStore } from 'pinia'
import { type TaskInfo, type TaskId, TaskStatus } from '@/types'

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [
      {
        id: 1,
        name: 'archlinux-2023.11.01-x86_64.iso',
        size: 914856640,
        status: TaskStatus.RUNNING,
        downloaded: 457428320,
      },
      { id: 2, name: 'vue-devtools-6.5.0.crx', size: 2306867, status: TaskStatus.PAUSED, downloaded: 922746 },
      { id: 3, name: 'pretty-bytes-v10.0.0.zip', size: 1258291, status: TaskStatus.COMPLETED },
      {
        id: 4,
        name: 'ubuntu-22.04.3-desktop-amd64.iso',
        size: 5153960755,
        status: TaskStatus.FAILED,
        downloaded: 1030792151,
        last_error: 'network error',
      },
      { id: 5, name: 'node-v20.9.0-win-x64.zip', size: 31457280, status: TaskStatus.CANCELLED },
    ] as TaskInfo[],
  }),

  getters: {
    active: state =>
      state.tasks.filter(task => task.status === TaskStatus.RUNNING || task.status === TaskStatus.PAUSED),
    deactive: state =>
      state.tasks.filter(
        task =>
          task.status === TaskStatus.COMPLETED ||
          task.status === TaskStatus.FAILED ||
          task.status === TaskStatus.CANCELLED
      ),
  },

  actions: {
    resumeTask(id: TaskId) {
      console.log(`恢复任务 #${id}`)
      const task = this.tasks.find(t => t.id === id)
      if (task) {
        task.status = TaskStatus.RUNNING
      }
    },
    pauseTask(id: TaskId) {
      console.log(`暂停任务 #${id}`)
      const task = this.tasks.find(t => t.id === id)
      if (task) {
        task.status = TaskStatus.PAUSED
      }
    },
    cancelTask(id: TaskId) {
      console.log(`取消任务 #${id}`)
      const task = this.tasks.find(t => t.id === id)
      if (task) {
        task.status = TaskStatus.CANCELLED
      }
    },
    openFile(id: TaskId) {
      console.log(`打开文件 #${id}`)
    },
    openFolder(id: TaskId) {
      console.log(`打开任务 #${id} 所在文件夹`)
    },
    removeRecord(id: TaskId) {
      console.log(`移除记录 #${id}`)
      this.tasks = this.tasks.filter(t => t.id !== id)
    },
    removeFileAndRecord(id: TaskId) {
      console.log(`删除文件和记录 #${id}`)
      this.tasks = this.tasks.filter(t => t.id !== id)
    },
  },
})

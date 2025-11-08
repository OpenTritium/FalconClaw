import { defineStore } from 'pinia'
import { type TaskInfo, type TaskId, TaskStatus, TaskList } from '@/types/task'
import { FAILED_CONNECT_TO_NATIVE, NativePayload } from '@/entrypoints/background'
import { match, P } from 'ts-pattern'
import { type } from 'arktype'

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    has_connect_error: false,
    was_fetch_all: false,
    tasks: [] as TaskInfo[],
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
    listenForUpdates() {
      const port = browser.runtime.connect({ name: 'popup' })
      port.onMessage.addListener((payload: NativePayload) => {
        match([payload, this.was_fetch_all])
          .with([FAILED_CONNECT_TO_NATIVE, P._], () => {
            console.error('Backgorund -> Popup: 无法连接本地端口')
            this.has_connect_error = true
          })
          .with([P.array(), false], ([receivedTasks, _]) => {
            const validated = TaskList(receivedTasks)
            if (validated instanceof type.errors) {
              console.error(validated.summary)
              return
            }
            console.log(`Background -> Popup: 收到全量快照，共 ${validated.length} 个任务。`)
            this.tasks = validated
            this.was_fetch_all = true
          })
          .with([P.array(), true], ([receivedTasks, _]) => {
            console.log(`Background -> Popup: 收到 ${receivedTasks.length} 个任务更新进行合并。`)
            for (const updatedTask of receivedTasks) {
              const index = this.tasks.findIndex(t => t.id === updatedTask.id)
              if (index !== -1) {
                this.tasks.splice(index, 1, updatedTask)
              } else {
                this.tasks.unshift(updatedTask)
              }
            }
          })
          .exhaustive()
      })
      port.onDisconnect.addListener(() => {
        this.was_fetch_all = false
        console.error('Popup -x-> Background: 断开连接')
      })
    },

    resumeTask(id: TaskId) {
      console.log(`恢复任务 #${id}`)
      const task = this.tasks.find(t => t.id === id)
      if (task) {
        task.status = TaskStatus.RUNNING
        // 如果是从暂停状态恢复，保持已下载的数据
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

import { defineStore } from 'pinia'
import { type TaskInfo, TaskId, TaskStatus, TaskList } from '@/types/task'
import { FAILED_CONNECT_TO_NATIVE, NativePayload } from '@/entrypoints/background'
import { match, P } from 'ts-pattern'
import { Command, CommandName } from '@/types/cmd'

const port = browser.runtime.connect({ name: 'popup' })

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    has_connect_error: false,
    was_fetch_all: false,
    tasks: [] as TaskInfo[],
  }),

  getters: {
    active: state =>
      state.tasks.filter(
        task =>
          task.status === TaskStatus.RUNNING || task.status === TaskStatus.PAUSED || task.status == TaskStatus.IDLE
      ),
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
      port.onMessage.addListener((payload: NativePayload) => {
        match([payload, this.was_fetch_all])
          .with([FAILED_CONNECT_TO_NATIVE, P._], () => {
            console.error('Backgorund -> Popup: 无法连接本地端口')
            this.has_connect_error = true
          })
          .with([P.array(), P._], ([receivedTasks, _]) => {
            const tasks = receivedTasks as TaskInfo[]
            if (!this.was_fetch_all) {
              console.log(`Background -> Popup: 收到全量快照，共 ${tasks.length} 个任务。`)
              this.tasks = tasks
              this.was_fetch_all = true
            } else {
              console.log(`Background -> Popup: 收到 ${receivedTasks.length} 个任务更新进行合并。`)
              for (const updatedTask of receivedTasks) {
                const index = this.tasks.findIndex(t => t.id === updatedTask.id)
                if (index !== -1) {
                  this.tasks.splice(index, 1, updatedTask)
                } else {
                  this.tasks.unshift(updatedTask)
                }
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
      let resume_cmd: Command = { opt: CommandName.RESUME, id }
      port.postMessage(resume_cmd)
      console.log(`恢复任务 #${id}`)
      const task = this.tasks.find(t => t.id === id)
      if (task) {
        task.status = TaskStatus.RUNNING
        // 如果是从暂停状态恢复，保持已下载的数据
      }
    },

    pauseTask(id: TaskId) {
      let pause_cmd: Command = { opt: CommandName.PAUSE, id }
      port.postMessage(pause_cmd)
      console.log(`暂停任务 #${id}`)
      const task = this.tasks.find(t => t.id === id)
      if (task) {
        task.status = TaskStatus.PAUSED
      }
    },

    cancelTask(id: TaskId) {
      let cancel_cmd: Command = { opt: CommandName.CANCEL, id }
      port.postMessage(cancel_cmd)
      console.log(`取消任务 #${id}`)
      const task = this.tasks.find(t => t.id === id)
      if (task) {
        task.status = TaskStatus.CANCELLED
      }
    },

    openFile(id: TaskId) {
      // todo
      console.log(`打开文件 #${id}`)
    },

    openFolder(id: TaskId) {
      // todo
      console.log(`打开任务 #${id} 所在文件夹`)
    },

    removeRecord(id: TaskId) {
      let remove_cmd: Command = { opt: CommandName.REMOVE, id }
      port.postMessage(remove_cmd)
      console.log(`移除记录 #${id}`)
      this.tasks = this.tasks.filter(t => t.id !== id)
    },

    removeFileAndRecord(id: TaskId) {
      console.log(`删除文件和记录 #${id}`)
      this.tasks = this.tasks.filter(t => t.id !== id)
    },
  },
})

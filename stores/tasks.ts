import { defineStore } from 'pinia'
import { type TaskInfo, type TaskId, TaskStatus } from '@/types'

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [
      // 进行中的任务
      {
        id: 1,
        name: 'archlinux-2023.11.01-x86_64.iso',
        size: 914856640,
        status: TaskStatus.RUNNING,
        downloaded: 457428320,
      },
      {
        id: 2,
        name: 'vue-devtools-6.5.0.crx',
        size: 2306867,
        status: TaskStatus.PAUSED,
        downloaded: 922746,
      },
      {
        id: 6,
        name: 'Windows 11.iso',
        size: 5368709120,
        status: TaskStatus.RUNNING,
        downloaded: 2147483648,
      },
      {
        id: 7,
        name: 'Adobe_Photoshop_2024.rar',
        size: 2147483648,
        status: TaskStatus.PAUSED,
        downloaded: 1073741824,
      },
      {
        id: 8,
        name: 'Node.js v20.9.0 LTS.dmg',
        size: 31457280,
        status: TaskStatus.RUNNING,
        downloaded: 15728640,
      },

      // 已完成的任务
      {
        id: 3,
        name: 'pretty-bytes-v10.0.0.zip',
        size: 1258291,
        status: TaskStatus.COMPLETED,
      },
      {
        id: 9,
        name: 'VSCode-linux-x64.tar.gz',
        size: 104857600,
        status: TaskStatus.COMPLETED,
      },
      {
        id: 10,
        name: 'Docker Desktop Installer.exe',
        size: 681574400,
        status: TaskStatus.COMPLETED,
      },
      {
        id: 11,
        name: 'Postman-10.19.0-linux-x64.tar.gz',
        size: 135266304,
        status: TaskStatus.COMPLETED,
      },

      // 失败的任务
      {
        id: 4,
        name: 'ubuntu-22.04.3-desktop-amd64.iso',
        size: 5153960755,
        status: TaskStatus.FAILED,
        downloaded: 1030792151,
        last_error: 'network error',
      },
      {
        id: 12,
        name: 'CentOS-8.5.0-x86_64.iso',
        size: 10737418240,
        status: TaskStatus.FAILED,
        downloaded: 2147483648,
        last_error: 'checksum verification failed',
      },

      // 已取消的任务
      {
        id: 5,
        name: 'node-v20.9.0-win-x64.zip',
        size: 31457280,
        status: TaskStatus.CANCELLED,
      },
      {
        id: 13,
        name: 'MongoDB Compass-1.39.0-win32-x64.exe',
        size: 115343360,
        status: TaskStatus.CANCELLED,
      },
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

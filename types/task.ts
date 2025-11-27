import { type } from 'arktype'

/**
 * 任务的唯一标识符，非负整数。
 */
export const TaskId = type('number>=0')
export type TaskId = typeof TaskId.infer

/**
 * 定义所有可能的任务状态名称的常量。
 * 'as const' 确保了这些值是只读的，并为类型推断提供了精确的字符串字面量。
 */
export const TaskStatus = {
  IDLE: 'idle',
  RUNNING: 'running',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  FAILED: 'failed',
} as const

/**
 * 任务状态名称的联合类型。
 */
export type TaskStatusName = (typeof TaskStatus)[keyof typeof TaskStatus]

/**
 * 使用 ArkType 定义任务状态的可辨识联合（Discriminated Union）。
 * ArkType 的 "morph" 功能可以优雅地处理这种模式，根据 "status" 字段的不同
 * 来决定对象的具体形态。
 */
export const TaskState = type({
  status: '"idle" | "completed" | "cancelled"',
})
  .or({
    status: '"running" | "paused"',
    downloaded: 'number',
  })
  .or({
    status: '"failed"',
    downloaded: 'number',
    last_error: 'string',
  })

/**
 * 任务信息
 */
export const TaskInfo = type({
  id: TaskId,
  name: 'string',
  url: 'string',
  'path?': 'string',
  'size?': 'number',
}).and(TaskState)

/**
 * 任务信息类型
 */
export type TaskInfo = typeof TaskInfo.infer

export const TaskList = type(TaskInfo.array())

// 0-100
export function progress_in_percentage(status: TaskInfo): number {
  switch (status.status) {
    case TaskStatus.RUNNING:
    case TaskStatus.PAUSED:
    case TaskStatus.FAILED:
      // 'size' 可能不存在，提供一个默认值以避免除以零
      if (!status.size) {
        return 50
      }
      return Math.min(100, Math.floor((status.downloaded / status.size) * 100))
    case TaskStatus.COMPLETED:
      return 100
    default:
      return 0
  }
}

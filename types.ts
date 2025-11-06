/**
 * 任务的唯一标识符。
 */
export type TaskId = number

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
 * 定义每种任务状态下的具体数据结构（Payload）。
 */
type TaskStatePayloads = {
  [TaskStatus.IDLE]: {}
  [TaskStatus.RUNNING]: { downloaded: number }
  [TaskStatus.PAUSED]: { downloaded: number }
  [TaskStatus.COMPLETED]: {}
  [TaskStatus.CANCELLED]: {}
  [TaskStatus.FAILED]: { last_error: string; downloaded: number }
}

/**
 * 任务状态的可辨识联合（Discriminated Union）。
 * `status` 字段作为辨识符，其类型是 TaskStatusName，
 * 这清晰地将状态名称与对应的 Payload 关联起来。
 */
type TaskState = { [K in TaskStatusName]: { status: K } & TaskStatePayloads[K] }[TaskStatusName]

/**
 * 定义一个任务（Task）的完整结构。
 * 它包含了任务的基础信息和当前的状态。
 */
export type TaskInfo = {
  id: TaskId
  name: string
  size?: number
} & TaskState

// 0-100
export function progress_in_percentage(status: TaskInfo): number {
  switch (status.status) {
    case TaskStatus.RUNNING:
    case TaskStatus.PAUSED:
    case TaskStatus.FAILED:
      return Math.min(100, Math.floor((status.downloaded / (status.size ?? 1)) * 100))
    case TaskStatus.COMPLETED:
      return 100
    default:
      return 0
  }
}

/**
 * 定义所有可能的命令名称的常量。
 */
export const CommandName = {
  CHANGE_CONCURRENCY: 'change_concurrency',
  CHANGE_RATE_LIMIT: 'change_rate_limit',
  PAUSE: 'pause',
  RESUME: 'resume',
  CANCEL: 'cancel',
  CREATE: 'create',
  REMOVE: 'remove',
} as const

/**
 * 命令名称的联合类型。
 */
export type CommandTypeName = (typeof CommandName)[keyof typeof CommandName]

/**
 * 定义每种命令对应的 Payload。
 */
type CommandPayloads = {
  [CommandName.CHANGE_CONCURRENCY]: { id: TaskId; concurrency: number }
  [CommandName.CHANGE_RATE_LIMIT]: { id: TaskId; limit: number }
  [CommandName.PAUSE]: { id: TaskId }
  [CommandName.RESUME]: { id: TaskId }
  [CommandName.CANCEL]: { id: TaskId }
  [CommandName.CREATE]: { url: string }
  [CommandName.REMOVE]: { id: TaskId }
}

/**
 * 命令的可辨识联合。
 * `name` 字段作为辨识符，清晰地定义了每个命令的结构。
 */
export type Command = {
  [K in CommandTypeName]: { name: K } & (K extends keyof CommandPayloads ? CommandPayloads[K] : {})
}[CommandTypeName]

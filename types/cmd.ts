import { TaskId } from './task'

/**
 * 定义所有可能的命令名称的常量
 */
export const CommandName = {
  CHANGE_CONCURRENCY: 'change_concurrency',
  CHANGE_RATE_LIMITED: 'change_rate_limited',
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
  [CommandName.CHANGE_CONCURRENCY]: {
    id: TaskId
    concurrency: number
  }
  [CommandName.CHANGE_RATE_LIMITED]: {
    id: TaskId
    limit: number | null
  }
  [CommandName.PAUSE]: { id: TaskId }
  [CommandName.RESUME]: { id: TaskId }
  [CommandName.CANCEL]: { id: TaskId }
  [CommandName.CREATE]: { url: string }
  [CommandName.REMOVE]: { id: TaskId }
}

/**
 * 命令的可辨识联合。
 * `opt` 字段作为辨识符，以匹配 Rust 的 `#[serde(tag = "opt")]`。
 */
export type Command = {
  [K in CommandTypeName]: {
    opt: K
  } & CommandPayloads[K]
}[CommandTypeName]

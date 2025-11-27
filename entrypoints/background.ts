import { Command, CommandName } from '@/types/cmd'
import { TaskId, TaskInfo, TaskList } from '@/types/task'
import { type } from 'arktype'

const cache = new Map<TaskId, TaskInfo>()

export const FAILED_CONNECT_TO_NATIVE = 'FailedConnectToNative'
export type NativePayload = TaskInfo[] | typeof FAILED_CONNECT_TO_NATIVE

const NativeAppName = 'com.opentritium.falcon_claw'

export default defineBackground(() => {
  const { runtime, downloads } = browser
  let nativePort: Browser.runtime.Port | null = runtime.connectNative(NativeAppName)
  let popupPort: Browser.runtime.Port | null = null
  // 如果连接失败 lasterror 不会立刻产生，你需要设置 onDisconnect 回调将 nativePort 置空
  nativePort.onDisconnect.addListener(() => {
    console.error(`Background: native port 断开连接，原因：${runtime.lastError?.message}`)
    nativePort = null
  })
  // nativeport 来消息的时候转发给 popup，此时可能 popup 恰好关闭，光靠 ？断言不太行
  nativePort.onMessage.addListener(msg => {
    const tasks = TaskList(msg)
    if (tasks instanceof type.errors) {
      console.error(tasks.summary)
      return
    }
    tasks.map(task => cache.set(task.id, task))
    console.log('cache: ', cache)
    try {
      popupPort?.postMessage(msg)
    } catch (_) {
      popupPort = null
      console.info('Background: 发送消息时发现 Popup 已断开连接，主动置空')
    }
  })
  runtime.onConnect.addListener(port => {
    if (port.name !== 'popup') return
    popupPort = port
    if (!nativePort) {
      // 如果 nativeport 断开，但 popup 刚连接上就告诉 popup nativeport 连接失败
      popupPort?.postMessage(FAILED_CONNECT_TO_NATIVE)
      return
    }
    // 此时 popup 连上了，给 popup 一个快照
    popupPort?.postMessage(Array.from(cache.values()))
    console.log('post cache to popup', Array.from(cache.values()))
    // popup 断开连接的时候就置空
    port.onDisconnect.addListener(() => {
      popupPort = null
    })
    port.onMessage.addListener((cmd: Command) => {
      nativePort?.postMessage(cmd)
    })
  })

  downloads.onDeterminingFilename.addListener(async downloadItem => {
    console.log(`onCreated: 拦截到 URL: ${downloadItem.url}`)
    await downloads.cancel(downloadItem.id)
    let createCmd: Command = { opt: CommandName.CREATE, url: downloadItem.finalUrl }
    console.log(`发送创建任务命令: ${JSON.stringify(createCmd)}`)
    nativePort?.postMessage(createCmd)
  })
})

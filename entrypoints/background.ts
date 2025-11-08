import { TaskInfo } from '@/types/task'

const NativeCommand = {
  SUBSCRIBE: 'subscribe',
  UNSUBSCRIBE: 'unsubscribe',
} as const

export const FAILED_CONNECT_TO_NATIVE = 'FailedConnectToNative'
export type NativePayload = TaskInfo[] | typeof FAILED_CONNECT_TO_NATIVE

const NativeAppName = 'com.example.my_native_app'

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
    try {
      popupPort?.postMessage(msg)
    } catch (_) {
      popupPort = null
      console.info('Background: 发送消息时发现 Popup 已断开连接，主动置空')
    }
  })
  runtime.onConnect.addListener(port => {
    popupPort = port
    if (!nativePort) {
      // 如果 nativeport 断开，但 popup 刚连接上就告诉 popup nativeport 连接失败
      popupPort?.postMessage(FAILED_CONNECT_TO_NATIVE)
      return
    }
    // 此时 popup 连上了，尝试告诉 nativeport 开始订阅更新
    nativePort.postMessage(NativeCommand.SUBSCRIBE)
    console.log('Background: Popup 连接，通知 Native 开始订阅更新')
    // popup 断开连接的时候 nativeport 几乎总是在线，就通知 native 程序停止订阅
    port.onDisconnect.addListener(() => {
      nativePort?.postMessage(NativeCommand.UNSUBSCRIBE)
      console.log('Background: Popup 断开连接，通知 Native 停止订阅更新')
    })
  })
  downloads.onCreated.addListener(async downloadItem => {
    console.log(`onCreated: 拦截到 URL: ${downloadItem.url}`)
    await downloads.cancel(downloadItem.id)
    console.log('下载已被成功取消！')
  })
})

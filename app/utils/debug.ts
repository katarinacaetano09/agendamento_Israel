import { ref } from 'vue'

export const debugLogs = ref<string[]>([])

export function addDebug(...args: any[]) {
  try {
    const parts = args.map(a => {
      if (typeof a === 'string') return a
      try { return JSON.stringify(a, null, 2) } catch (e) { return String(a) }
    })
    const line = parts.join(' ')
    debugLogs.value.push(line)
    // keep it bounded
    if (debugLogs.value.length > 500) debugLogs.value.shift()
  } catch (e) {
    // ignore
  }
}

export function clearDebug() {
  debugLogs.value = []
}

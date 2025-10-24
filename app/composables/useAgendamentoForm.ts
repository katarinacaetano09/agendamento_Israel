import { computed } from 'vue'

export function gerarHorarios(inicio: string, fim: string, stepMin: number = 30) {
  const res: string[] = []
  const [hRaw, mRaw] = inicio.split(':')
  const [hFimRaw, mFimRaw] = fim.split(':')
  const h = Number(hRaw)
  const m = Number(mRaw)
  const hFim = Number(hFimRaw)
  const mFim = Number(mFimRaw)
  if ([h, m, hFim, mFim].some(v => isNaN(v))) return res
  let curH = h
  let curM = m
  while (curH < hFim || (curH === hFim && curM < mFim)) {
    const hh = curH.toString().padStart(2, '0')
    const mm = curM.toString().padStart(2, '0')
    res.push(`${hh}:${mm}`)
    curM += stepMin
    if (curM >= 60) { curH++; curM = curM - 60 }
  }
  return res
}

export function formatTimeForDb(hora: string | null) {
  if (!hora) return null
  const m = hora.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/) 
  if (!m) return null
  const hRaw = m[1] || '0'
  const min = m[2] || '00'
  const sec = m[3] || '00'
  const h = hRaw.padStart(2, '0')
  return `${h}:${min}:${sec}`
}

export function horaParaMinutos(hora: string | null) {
  if (!hora) return null
  const m = hora.match(/(\d{1,2}):(\d{2})/)
  if (!m) return null
  const h = Number(m[1])
  const min = Number(m[2])
  if (isNaN(h) || isNaN(min)) return null
  return h * 60 + min
}

export function computeIntervalosOcupados(agendamentos: any[] | undefined) {
  const intervals: Array<{ inicio: number; fim: number }> = []
  if (!agendamentos || !Array.isArray(agendamentos)) return intervals
  for (const a of agendamentos) {
    const ini = horaParaMinutos(a.hora_inicio)
    const fim = horaParaMinutos(a.hora_fim)
    if (ini === null || fim === null) continue
    intervals.push({ inicio: ini, fim })
  }
  return intervals
}

export function intervaloDisponivel(intervalos: Array<{ inicio: number; fim: number }>, inicioStr: string, fimStr: string) {
  const ini = horaParaMinutos(inicioStr)
  const f = horaParaMinutos(fimStr)
  if (ini === null || f === null) return false
  for (const i of intervalos) {
    if (typeof i.inicio !== 'number' || typeof i.fim !== 'number') continue
    if (ini < i.fim && f > i.inicio) return false
  }
  return true
}

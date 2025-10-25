import { computed, ref, watch } from 'vue'

export function useNewAgendamentoForm(props: { profissional?: any; datas?: Date[]; ocupados?: Record<string, any[]> }) {
  // cliente selecionado: guardamos o id e o texto exibido
  const clienteSelecionadoId = ref<number | null>(null)
  const clienteTexto = ref('')

  // Demais campos do formulário
  const titulo = ref('')
  const descricao = ref('')
  const selectedDate = ref('')
  const horaInicio = ref('')
  const horaFim = ref('')
  const selectedColor = ref<string | null>('#e5e7eb')

  // configurações
  const MIN_DURATION_MIN = 30 // duração mínima em minutos

  // helpers de tempo
  function timeToMinutes(t: string) {
    const [hh, mm] = (t || '').split(':')
    return Number(hh || 0) * 60 + Number(mm || 0)
  }
  function minutesToTime(m: number) {
    const hh = Math.floor(m / 60).toString().padStart(2, '0')
    const mm = (m % 60).toString().padStart(2, '0')
    return `${hh}:${mm}`
  }

  function mergeIntervals(intervals: Array<[number, number]>) {
    if (!intervals || intervals.length === 0) return [] as Array<[number, number]>
    const sorted = intervals.slice().sort((a, b) => a[0] - b[0])
    const res: Array<[number, number]> = []
    const first = sorted[0]!
    let curStart = first[0]
    let curEnd = first[1]
    for (let i = 1; i < sorted.length; i++) {
      const pair = sorted[i]!
      const s = pair[0]
      const e = pair[1]
      if (s <= curEnd) {
        curEnd = Math.max(curEnd, e)
      } else {
        res.push([curStart, curEnd])
        curStart = s
        curEnd = e
      }
    }
    res.push([curStart, curEnd])
    return res
  }

  function intervalsIntersect(aStart: number, aEnd: number, bStart: number, bEnd: number) {
    return Math.max(aStart, bStart) < Math.min(aEnd, bEnd)
  }

  // Horários de 30 em 30 minutos
  function gerarHorarios(inicio: string, fim: string, stepMin: number = 30) {
    const res: string[] = [];
    const [hRaw, mRaw] = inicio.split(':');
    const [hFimRaw, mFimRaw] = fim.split(':');
    const h = Number(hRaw);
    const m = Number(mRaw);
    const hFim = Number(hFimRaw);
    const mFim = Number(mFimRaw);
    if ([h, m, hFim, mFim].some(v => isNaN(v))) return res;
    let curH = h;
    let curM = m;
    while (curH < hFim || (curH === hFim && curM < mFim)) {
      const hh = curH.toString().padStart(2, '0');
      const mm = curM.toString().padStart(2, '0');
      res.push(`${hh}:${mm}`);
      curM += stepMin;
      if (curM >= 60) { curH++; curM = curM - 60; }
    }
    return res;
  }
  const timeInicioOptions = gerarHorarios('08:00', '22:00')

  // pega os agendamentos ocupados para a data selecionada e transforma em intervalos mesclados (minutos)
  const ocupadosParaData = computed(() => {
    const key = selectedDate.value || ''
    const list = (props.ocupados && props.ocupados[key]) || []
    const intervals: Array<[number, number]> = []
    for (const a of list) {
      if (!a || !a.hora_inicio || !a.hora_fim) continue
      const s = timeToMinutes(String(a.hora_inicio).slice(0,5))
      const e = timeToMinutes(String(a.hora_fim).slice(0,5))
      if (!isNaN(s) && !isNaN(e) && e > s) intervals.push([s, e])
    }
    return mergeIntervals(intervals)
  })

  // opções de início filtradas — remove inícios que gerariam conflito com ocupados
  const timeInicioOptionsFiltered = computed(() => {
    const occupied = ocupadosParaData.value
    const res: string[] = []
    for (const t of timeInicioOptions) {
      const s = timeToMinutes(t)
      const e = s + MIN_DURATION_MIN
      const intersects = occupied.some(([os, oe]) => intervalsIntersect(s, e, os, oe))
      if (!intersects) res.push(t)
    }
    return res
  })

  // timeFimOptions agora deve derivar não só do slice, mas também considerando ocupados
  const timeFimOptions = computed(() => {
    if (!horaInicio.value) return []
    const base = timeInicioOptions
    const idx = base.indexOf(horaInicio.value)
    if (idx === -1) return []
    const candidate = base.slice(idx + 1)
    const occupied = ocupadosParaData.value
    const start = timeToMinutes(horaInicio.value)
    const allowed: string[] = []
    for (const t of candidate) {
      const end = timeToMinutes(t)
      if (end <= start) continue
      const intersects = occupied.some(([os, oe]) => intervalsIntersect(start, end, os, oe))
      if (!intersects) allowed.push(t)
    }
    return allowed
  })

  const dateOptions = computed(() => {
    const arr: Array<{ value: string; label: string }> = []
    const datas = props.datas || []
    for (const d of datas) {
      const iso = d.toISOString().slice(0, 10)
      arr.push({ value: iso, label: d.toLocaleDateString() })
    }
    return arr
  })

  // Sempre que horaInicio mudar, já sugere o próximo slot para horaFim
  watch(horaInicio, (novo) => {
    if (!novo) { horaFim.value = '' }
    else {
      const idx = timeInicioOptions.indexOf(novo)
      if (idx !== -1 && typeof timeInicioOptions[idx + 1] === 'string') {
        horaFim.value = timeInicioOptions[idx + 1] as string
      } else {
        horaFim.value = ''
      }
    }
  })

  return {
    clienteSelecionadoId,
    clienteTexto,
    titulo,
    descricao,
    selectedDate,
    horaInicio,
    horaFim,
    selectedColor,
    timeInicioOptionsFiltered,
    timeFimOptions,
    dateOptions,
  }
}

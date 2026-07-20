import type { AlarmLevel } from '@/features/interventions/types/intervention.types'

interface AlarmLevelIndicatorProps {
  level: AlarmLevel
  onClick?: () => void
}

/* Muestra visualmente el grado de alarma calculado por la sesión. */
export function AlarmLevelIndicator({ level, onClick }: AlarmLevelIndicatorProps) {
  const colorClasses =
    level === 1 ? 'border-green-500 bg-green-200 text-green-900 hover:bg-green-300'
      : level === 2 ? 'border-yellow-500 bg-yellow-200 text-yellow-900 hover:bg-yellow-300'
        : 'border-red-500 bg-red-200 text-red-900 hover:bg-red-300'

  return (
    <button
      type="button"
      className={'flex min-w-24 items-center justify-center gap-2 rounded-lg border px-3 py-2 ' + colorClasses}
      aria-label={`Abrir ficha. Grado de alarma ${level}`}
      aria-haspopup="dialog"
      title='Abrir ficha'
      onClick={onClick}
    >
      <span className="text-[15px] font-bold leading-none">{level + 'ª'}</span>

      <span className="text-[15px] font-bold uppercase tracking-wide">
        Alarma
      </span>
    </button>
  )
}
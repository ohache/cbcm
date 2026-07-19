import type { AlarmLevel } from '../types/intervention.types'

interface AlarmLevelIndicatorProps {
  level: AlarmLevel
}

/* Muestra visualmente el grado de alarma calculado por la sesión. */
export function AlarmLevelIndicator({ level }: AlarmLevelIndicatorProps) {
  const colorClasses =
    level === 1 ? 'border-green-300 bg-green-100 text-green-800'
    : level === 2 ? 'border-yellow-300 bg-yellow-100 text-yellow-900'
      : 'border-red-300 bg-red-100 text-red-800'

  return (
    <div
      className={'flex min-w-24 items-center justify-center gap-2 rounded-lg border px-3 py-2 ' + colorClasses}
      role="status"
      aria-label={`Grado de alarma ${level}`}
    >
      <span className="text-xs font-semibold uppercase tracking-wide">
        Alarma
      </span>

      <span className="text-2xl font-bold leading-none">{level}</span>
    </div>
  )
}
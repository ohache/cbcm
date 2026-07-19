import type { AlarmLevel } from '../types/intervention.types'

interface AlarmLevelIndicatorProps {
  level: AlarmLevel
  onClick?: () => void
}

/* Muestra visualmente el grado de alarma calculado por la sesión. */
export function AlarmLevelIndicator({ level, onClick }: AlarmLevelIndicatorProps) {
  const colorClasses =
    level === 1 ? 'border-green-300 bg-green-100 text-green-800'
      : level === 2 ? 'border-yellow-300 bg-yellow-100 text-yellow-900'
        : 'border-red-300 bg-red-100 text-red-800'

  return (
    <button
      type="button"
      className={'flex min-w-24 items-center justify-center gap-2 rounded-lg border ' +
        'px-3 py-2 transition hover:-translate-y-0.5 hover:shadow-md ' + colorClasses}
      aria-label={`Abrir ficha. Grado de alarma ${level}`}
      aria-haspopup="dialog"
      onClick={onClick}
    >
      <span className="text-xs font-semibold uppercase tracking-wide">
        Alarma
      </span>

      <span className="text-2xl font-bold leading-none">{level}</span>
    </button>
  )
}
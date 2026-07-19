import { useEffect, useRef } from 'react'
import type { AlarmLevel } from '@/features/interventions/types/intervention.types'

interface InterventionSheetModalProps {
  title: string
  alarmLevel: AlarmLevel
  imageSrc: string
  onClose: () => void
}

/* Modal que muestra la ficha original de Activación/Aviso. */
export function InterventionSheetModal({ title, alarmLevel, imageSrc, onClose }: InterventionSheetModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const alarmClasses = alarmLevel === 1 ? 'bg-green-100 text-green-800'
      : alarmLevel === 2 ? 'bg-yellow-100 text-yellow-900'
        : 'bg-red-100 text-red-800'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className="flex max-h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="intervention-sheet-title"
      >
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h2
              id="intervention-sheet-title"
              className="text-xl font-semibold text-slate-900"
            >
              Ficha: {title}
            </h2>

            <span
              className={'mt-2 inline-flex rounded-md px-3 py-1 text-sm font-bold ' + alarmClasses}
            >
              Grado calculado: {alarmLevel}.ª alarma
            </span>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="rounded-md border border-slate-300 px-3 py-2 font-semibold text-slate-700 transition-colors hover:border-red-400 hover:text-red-700"
            onClick={onClose}
          >
            Cerrar
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-auto bg-slate-100 p-4">
          <img
            src={imageSrc}
            alt={`Ficha de Activación/Aviso de ${title}`}
            className="mx-auto h-auto max-w-full rounded-md bg-white shadow"
          />
        </div>
      </section>
    </div>
  )
}
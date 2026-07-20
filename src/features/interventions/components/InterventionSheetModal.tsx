import { useEffect } from 'react'
import type { AlarmLevel } from '@/features/interventions/types/intervention.types'

interface InterventionSheetModalProps {
  alarmLevel: AlarmLevel
  imageSrc: string
  onClose: () => void
}

/* Modal que muestra la ficha original de Activación/Aviso. */
export function InterventionSheetModal({ alarmLevel, imageSrc, onClose }: InterventionSheetModalProps) {

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const alarmClasses = alarmLevel === 1 ? 'bg-green-100 text-green-800 border-green-600'
      : alarmLevel === 2 ? 'bg-yellow-100 text-yellow-900 border-yellow-600'
        : 'bg-red-100 text-red-800 border-red-600'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className="flex max-h-[105vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="Ficha de Activación/Aviso"
      >
        <header className="flex shrink-0 justify-center border-b border-slate-200 px-5 py-4">
          <span className={'inline-flex rounded-md border px-3 py-1 text-[15px] font-bold ' + alarmClasses}
          >
            Grado calculado: {alarmLevel}.ª alarma
          </span>
        </header>

        <div className="min-h-0 flex-1 overflow-auto bg-slate-100 p-4">
          <img
            src={imageSrc}
            alt="Ficha de Activación/Aviso de la intervención"
            className="mx-auto h-auto max-w-full rounded-md bg-white shadow"
          />
        </div>
      </section>
    </div>
  )
}
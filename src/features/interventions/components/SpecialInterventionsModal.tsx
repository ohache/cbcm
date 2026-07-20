import { useEffect } from 'react'
import { specialInterventions } from '@/features/interventions/data/specialInterventions'

interface SpecialInterventionsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SpecialInterventionsModal({ isOpen, onClose }: SpecialInterventionsModalProps) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className={
        'fixed inset-0 z-50 flex items-center justify-center ' +
        'bg-slate-950/70 p-6'
      }
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="special-interventions-title"
        className={
          'flex max-h-[80dvh] w-full max-w-2xl flex-col overflow-hidden ' +
          'rounded-lg bg-white shadow-xl'
        }
      >
        <header
          className={
            'flex shrink-0 items-center justify-between gap-4 ' +
            'border-b border-slate-200 px-5 py-4'
          }
        >
          <h2
            id="special-interventions-title"
            className="text-lg font-semibold text-slate-900"
          >
            Intervenciones especiales
          </h2>

          <button
            type="button"
            onClick={onClose}
            className={
              'rounded-md px-3 py-1 text-sm font-semibold text-slate-600 ' +
              'transition-colors hover:bg-slate-100 hover:text-slate-900'
            }
          >
            Cerrar
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {specialInterventions.length > 0 ? (
            <ul className="space-y-3">
              {specialInterventions.map((intervention) => (
                <li
                  key={intervention.id}
                  className={
                    'flex items-center justify-between gap-4 rounded-md ' +
                    'border border-slate-200 p-4'
                  }
                >
                  <span className="font-semibold text-slate-800">
                    {intervention.title}
                  </span>

                  <a
                    href={
                      import.meta.env.BASE_URL +
                      intervention.documentPath.replace(/^\/+/, '')
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                      'shrink-0 rounded-md border border-cyan-700 ' +
                      'bg-cyan-800 px-3 py-2 text-sm font-semibold ' +
                      'text-white transition-colors hover:bg-cyan-700'
                    }
                  >
                    Abrir documento
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">
              No hay intervenciones especiales disponibles.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
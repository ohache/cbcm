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

    return () => { document.removeEventListener('keydown', handleKeyDown) }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className={'fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70'}
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="special-interventions-title"
        className={'flex max-h-[80dvh] w-full max-w-lg flex-col overflow-hidden rounded-lg border-3 border-slate-700 bg-slate-900 shadow-xl'}
      >
        <header
          className={'flex shrink-0 justify-center border-b-2 border-slate-600 px-5 py-4'}
        >
          <h2
            id="special-interventions-title"
            className="text-lg font-semibold text-white"
          >
            Intervenciones especiales
          </h2>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {specialInterventions.length > 0 ? (
            <ul className="space-y-3">
              {specialInterventions.map((intervention) => (
                <li key={intervention.id}>
                  <a
                    href={
                      import.meta.env.BASE_URL +
                      intervention.documentPath.replace(/^\/+/, '')
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className={'flex w-full items-center justify-center rounded-md border-2 border-slate-700 ' +
                      'bg-slate-950 px-4 py-4 text-center text-white ' +
                      'transition duration-200 hover:border-emerald-500 hover:bg-emerald-950 hover:shadow-md'}
                  >
                    {intervention.title}
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
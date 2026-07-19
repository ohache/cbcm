import type { InterventionAdvice } from '@/features/interventions/types/intervention.types'

interface AdvicePanelProps {
  advice: InterventionAdvice[]
}

/* Muestra los consejos activados por las respuestas seleccionadas. */
export function AdvicePanel({ advice }: AdvicePanelProps) {
  return (
    <section
      className="flex min-h-0 flex-col rounded-lg border border-slate-200 bg-white"
      aria-labelledby="advice-title"
    >
      <header className="border-b border-slate-200 px-4 py-3">
        <h2 id="advice-title" className="font-semibold text-slate-900">
          Consejos
        </h2>
      </header>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
        {advice.map((item) => (
          <article
            key={item.id}
            className="rounded-md border border-amber-200 bg-amber-50 p-3"
          >
            <h3 className="text-sm font-semibold text-amber-900">
              {item.title}
            </h3>

            <p className="mt-1 text-sm leading-relaxed text-amber-950">
              {item.text}
            </p>
          </article>
          ))}
      </div>
    </section>
  )
}

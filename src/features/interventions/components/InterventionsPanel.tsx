import { InterventionCard } from './InterventionCard'
import interventionsCatalog from '../data/generated/index.json'

/* Panel principal del módulo de interrogatorios */
export function InterventionsPanel() {
  return (
    <section
      className="min-h-0 flex-1 overflow-y-auto p-6"
      aria-labelledby="interventions-title"
    >
      {/* El catálogo se genera automáticamente a partir de los Excel. */}
      <div className="grid grid-cols-[repeat(auto-fill,11rem)] items-start gap-4">
        {interventionsCatalog.map((intervention) => (
          <InterventionCard
            key={intervention.id}
            id={intervention.id}
            title={intervention.title}
          />
        ))}
      </div>
    </section>
  )
}

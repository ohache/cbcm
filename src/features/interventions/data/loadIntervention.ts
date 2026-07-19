import type { Intervention } from '@/features/interventions/types/intervention.types'

/* Forma de cada módulo JSON importado dinámicamente por Vite. */
interface InterventionModule {
  default: Intervention
}

const interventionModules = import.meta.glob<InterventionModule>(['./generated/*.json', '!./generated/index.json'])

/* Carga la intervención correspondiente al identificador de la URL */
export async function loadIntervention(interventionId: string): Promise<Intervention | undefined> {
  const modulePath = `./generated/${interventionId}.json`
  const importIntervention = interventionModules[modulePath]

  if (!importIntervention) return undefined

  const interventionModule = await importIntervention()
  return interventionModule.default
}

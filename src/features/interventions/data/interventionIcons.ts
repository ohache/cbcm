import { House, type LucideIcon } from 'lucide-react'

/* Relaciona el identificador guardado en el Excel con su icono de Lucide */
const interventionIcons: Record<string, LucideIcon> = {
  house: House,
}

/* Devuelve el icono correspondiente y detecta identificadores incorrectos. */
export function getInterventionIcon(iconName: string): LucideIcon {
  const Icon = interventionIcons[iconName]

  if (!Icon) throw new Error(`No existe el icono de intervención "${iconName}".`)

  return Icon
}
import { Link } from 'react-router'
import { getInterventionIcon } from '@/features/interventions/data/interventionIcons'

interface InterventionCardProps {
  id: string
  title: string
  icon: string
}

export function InterventionCard({ id, title, icon }: InterventionCardProps) {
  const Icon = getInterventionIcon(icon)
  
  return (
    <Link
      to={`/interrogatorios/${id}`}
      className="flex min-h-28 w-full transform-gpu flex-col items-center justify-center gap-2 rounded-md border-2 border-red-600 bg-red-950 
        px-3 py-3 font-semibold text-white transition duration-200 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-md"
    >

      <Icon
        className="h-8 w-8 shrink-0"
        strokeWidth={2}
        aria-hidden="true"
      />

      <span className="block w-full wrap-break-word text-center text-[17px] leading-snug">
        {title}
      </span>
    </Link>
  )
}

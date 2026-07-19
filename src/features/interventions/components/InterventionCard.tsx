import { Link } from 'react-router'

interface InterventionCardProps {
  id: string
  title: string
}

export function InterventionCard({ id, title }: InterventionCardProps) {
  return (
    <Link
      to={`/interrogatorios/${id}`}
      className={'flex min-h-16 w-full transform-gpu items-center justify-center rounded-md border-2 border-cyan-500 bg-cyan-800 px-3 py-3 ' +
        'font-semibold text-white transition duration-200 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:border-cyan-300 hover:shadow-md'
      }
    >
      <span className="block w-full wrap-break-word text-center text-[17px] leading-snug">
        {title}
      </span>
    </Link>
  )
}

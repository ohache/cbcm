import { useState } from 'react'
import { SpecialInterventionsModal } from '@/features/interventions/components/SpecialInterventionsModal'

export function SpecialInterventionsButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className={'text-white rounded-md border border-emerald-600 bg-emerald-950 px-3 py-2 ' +
          'text-[15px] font-semibold transition-colors hover:bg-emerald-900'}
      >
        Intervenciones especiales
      </button>

      <SpecialInterventionsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
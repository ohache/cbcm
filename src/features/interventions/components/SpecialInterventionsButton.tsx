import { useState } from 'react'
import { SpecialInterventionsModal } from '@/features/interventions/components/SpecialInterventionsModal'

export function SpecialInterventionsButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className={
          'rounded-md border border-amber-500 bg-amber-50 px-3 py-2 ' +
          'text-sm font-semibold text-amber-900 transition-colors ' +
          'hover:border-amber-600 hover:bg-amber-100'
        }
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
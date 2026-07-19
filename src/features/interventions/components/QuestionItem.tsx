import type { InterventionQuestion } from '@/features/interventions/types/intervention.types'

interface QuestionItemProps {
  question: InterventionQuestion
  selectedOptionId?: string
  onSelect: (questionId: string, optionId: string) => void
}

/* Muestra una pregunta y sus posibles respuestas. */
export function QuestionItem({ question, selectedOptionId, onSelect }: QuestionItemProps) {
  return (
    <div
      className={'grid items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-[minmax(12rem,1fr)_auto]'}
      role="group"
      aria-labelledby={`question-${question.id}`}
    >
      <p
        id={`question-${question.id}`}
        className="font-semibold text-slate-900"
      >
        {question.text}
      </p>

      <div className="flex flex-wrap gap-2 md:justify-end">
        {question.options.map((option) => {
          const isSelected = option.id === selectedOptionId

          return (
            <button
              key={option.id}
              type="button"
              className={'rounded-md border px-4 py-2 text-sm font-semibold transition-colors ' +
                (isSelected
                  ? 'border-red-700 bg-red-700 text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-red-400 hover:text-red-700')
              }
              aria-pressed={isSelected}
              onClick={() => onSelect(question.id, option.id)}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* Grados de alarma contemplados por la aplicación */
export type AlarmLevel = 1 | 2 | 3

/* Condición que determina cuándo debe mostrarse una pregunta */
export interface QuestionVisibilityCondition {
  questionId: string
  optionId: string
}

/* Opción disponible como respuesta a una pregunta */
export interface AnswerOption {
  id: string
  order: number
  label: string
  transcriptText: string
  minimumAlarmLevel: AlarmLevel
  adviceIds: string[]
  source?: string
}

/* Pregunta que forma parte del interrogatorio */
export interface InterventionQuestion {
  id: string
  order: number
  text: string
  required: boolean
  options: AnswerOption[]
  visibleWhen?: QuestionVisibilityCondition
  source?: string
}

/* Consejo que puede activarse a partir de una respuesta */
export interface InterventionAdvice {
  id: string
  order: number
  title: string
  text: string
  source?: string
}

export type InterventionDocumentType = "web" | "public"

/* Documento o enlace asociado a una intervención */
export interface InterventionDocument {
  id: string
  orden: number
  title: string
  type: InterventionDocumentType
  target: string
  source?: string
}

/* Definición completa de un tipo de intervención */
export interface Intervention {
  id: string
  title: string
  initialAlarmLevel: AlarmLevel
  schemaVersion: number
  questions: InterventionQuestion[]
  advice: InterventionAdvice[]
  documents: InterventionDocument[]
}

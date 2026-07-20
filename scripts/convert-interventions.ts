/// <reference types="node" />

import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import ExcelJS from 'exceljs'
import JSZip from 'jszip'

const INPUT_DIRECTORY = path.resolve('content/interventions')
const OUTPUT_DIRECTORY = path.resolve(
  'src/features/interventions/data/generated',
)

type AlarmLevel = 1 | 2 | 3

interface MetadataRow {
  Campo: string
  Valor: unknown
}

interface QuestionRow {
  id: string
  orden: number
  texto: string
  dependeDePreguntaId?: string
  dependeDeOpcionId?: string
  obligatoria: boolean
  fuenteRef?: string
}

interface OptionRow {
  preguntaId: string
  id: string
  orden: number
  etiqueta: string
  textoGenerado: string
  alarmaMinima: AlarmLevel
  consejosIds: string[]
  fuenteRef?: string
}

interface AdviceRow {
  id: string
  orden: number
  titulo: string
  texto: string
  fuenteRef?: string
}

type DocumentType = "web" | 'public'

interface DocumentRow {
  id: string
  orden: number
  titulo: string
  tipo: DocumentType
  destino: string
  fuenteRef?: string
}

interface InterventionFile {
  id: string
  title: string
  icon: string
  initialAlarmLevel: AlarmLevel
  schemaVersion: number
  questions: Array<{
    id: string
    order: number
    text: string
    required: boolean
    visibleWhen?: {
      questionId: string
      optionId: string
    }
    options: Array<{
      id: string
      order: number
      label: string
      transcriptText: string
      minimumAlarmLevel: AlarmLevel
      adviceIds: string[]
      source?: string
    }>
    source?: string
  }>
  advice: Array<{
    id: string
    order: number
    title: string
    text: string
    source?: string
  }>
  documents: Array<{
    id: string
    order: number
    title: string
    type: DocumentType
    target: string
    source?: string
  }>
}



/* Datos mínimos necesarios para mostrar una ficha en el panel inicial. */
interface InterventionSummary {
  id: string
  title: string
  icon: string
}

/**
 * Lee una hoja y convierte cada fila de datos en un objeto.
 *
 * En nuestra plantilla las filas 1 y 2 son informativas, la fila 3 está vacía
 * y la fila 4 contiene las cabeceras que utilizará el conversor.
 */
function normalizeCellValue(value: ExcelJS.CellValue): unknown {
  if (value === null || value === undefined) return ''
  if (value instanceof Date) return value
  if (typeof value !== 'object') return value

  // ExcelJS representa fórmulas, hipervínculos y texto enriquecido como objetos.
  if ('result' in value) return value.result ?? ''
  if ('text' in value) return value.text
  if ('richText' in value) {
    return value.richText.map((fragment) => fragment.text).join('')
  }

  return String(value)
}

function readSheet<T>(workbook: ExcelJS.Workbook, sheetName: string): T[] {
  const sheet = workbook.getWorksheet(sheetName)

  if (!sheet) {
    throw new Error(`No existe la hoja obligatoria «${sheetName}».`)
  }

  const headerRow = sheet.getRow(4)

  if (!headerRow.hasValues) {
    throw new Error(
      `La hoja «${sheetName}» no contiene las cabeceras en la fila 4.`,
    )
  }

  const headers: string[] = []

  headerRow.eachCell({ includeEmpty: true }, (cell, columnNumber) => {
    headers[columnNumber] = String(normalizeCellValue(cell.value)).trim()
  })

  const result: T[] = []

  // rowCount es el índice de la última fila; actualRowCount solo cuenta filas
  // con contenido y sería incorrecto cuando existen filas vacías intermedias.
  for (let rowNumber = 5; rowNumber <= sheet.rowCount; rowNumber += 1) {
    const row = sheet.getRow(rowNumber)
    const values = headers
      .slice(1)
      .map((_, index) => normalizeCellValue(row.getCell(index + 1).value))

    // Ignoramos las filas completamente vacías que pueda dejar Excel al final.
    if (values.every((value) => value === null || value === '')) continue

    result.push(
      Object.fromEntries(
        headers
          .slice(1)
          .map((header, index) => [header, values[index] ?? ''] as const)
          .filter(([header]) => header),
      ) as T,
    )
  }

  return result
}

function requiredText(value: unknown, field: string): string {
  const text = String(value ?? '').trim()

  if (!text) {
    throw new Error(`El campo «${field}» es obligatorio.`)
  }

  return text
}

function optionalText(value: unknown): string | undefined {
  const text = String(value ?? '').trim()
  return text || undefined
}

function parseNumber(value: unknown, field: string): number {
  const number = Number(value)

  if (!Number.isFinite(number)) {
    throw new Error(`El campo «${field}» debe ser numérico.`)
  }

  return number
}

function parseBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value !== 0

  return ['true', 'verdadero', 'sí', 'si', '1'].includes(
    String(value).trim().toLowerCase(),
  )
}

function parseAlarmLevel(value: unknown, field: string): AlarmLevel {
  const alarmLevel = parseNumber(value, field)

  if (![1, 2, 3].includes(alarmLevel)) {
    throw new Error(`El campo «${field}» debe tener el valor 1, 2 o 3.`)
  }

  return alarmLevel as AlarmLevel
}

function parseIdList(value: unknown): string[] {
  return String(value ?? '')
    .split(';')
    .map((id) => id.trim())
    .filter(Boolean)
}

function assertUniqueIds(items: Array<{ id: string }>, itemName: string): void {
  const ids = new Set<string>()

  for (const item of items) {
    if (ids.has(item.id)) {
      throw new Error(`El id de ${itemName} «${item.id}» está repetido.`)
    }

    ids.add(item.id)
  }
}

function parseDocumentType(
  value: unknown,
  field: string,
): DocumentType {
  const type = requiredText(value, field)

  if (type !== 'web' && type !== 'public') {
    throw new Error(
      `El campo «${field}» debe tener el valor «web» o «public».`,
    )
  }

  return type
}

/**
 * Normaliza los prefijos XML utilizados por algunos generadores de Excel.
 *
 * El archivo es válido, pero ExcelJS no interpreta correctamente etiquetas
 * como <x:workbook>, <x:sheets> o <x:worksheet>.
 */
async function loadWorkbook(filePath: string): Promise<ExcelJS.Workbook> {
  const fileBuffer = await readFile(filePath)
  const zip = await JSZip.loadAsync(fileBuffer)

  for (const fileName of Object.keys(zip.files)) {
    if (!fileName.endsWith('.xml')) continue

    const file = zip.file(fileName)

    if (!file) continue

    const xml = await file.async('string')

    // Solo modificamos los XML que emplean el prefijo principal «x».
    if (
      !xml.includes(
        'xmlns:x="http://schemas.openxmlformats.org/spreadsheetml/2006/main"',
      )
    ) {
      continue
    }

    const normalizedXml = xml
      .replace(/(<\/?)x:/g, '$1')
      .replace(
        'xmlns:x="http://schemas.openxmlformats.org/spreadsheetml/2006/main"',
        'xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"',
      )

    zip.file(fileName, normalizedXml)
  }

  const normalizedWorkbook = await zip.generateAsync({ type: 'nodebuffer' })

  const workbook = new ExcelJS.Workbook()

  const excelBuffer = normalizedWorkbook as unknown as Parameters<
    typeof workbook.xlsx.load
  >[0]

  await workbook.xlsx.load(excelBuffer)

  return workbook
}

/** Convierte y valida un único Excel de intervención. */
async function convertWorkbook(filePath: string): Promise<InterventionFile> {
  const workbook = await loadWorkbook(filePath)

  const metadataRows = readSheet<MetadataRow>(workbook, 'Metadatos')
  const metadata = new Map(
    metadataRows.map((row) => [String(row.Campo).trim(), row.Valor]),
  )

  const questionRows = readSheet<Record<string, unknown>>(
    workbook,
    'Preguntas',
  ).map<QuestionRow>((row) => ({
    id: requiredText(row.id, 'Preguntas.id'),
    orden: parseNumber(row.orden, 'Preguntas.orden'),
    texto: requiredText(row.texto, 'Preguntas.texto'),
    dependeDePreguntaId: optionalText(row.dependeDePreguntaId),
    dependeDeOpcionId: optionalText(row.dependeDeOpcionId),
    obligatoria: parseBoolean(row.obligatoria),
    fuenteRef: optionalText(row.fuenteRef),
  }))

  const optionRows = readSheet<Record<string, unknown>>(
    workbook,
    'Opciones',
  ).map<OptionRow>((row) => ({
    preguntaId: requiredText(row.preguntaId, 'Opciones.preguntaId'),
    id: requiredText(row.id, 'Opciones.id'),
    orden: parseNumber(row.orden, 'Opciones.orden'),
    etiqueta: requiredText(row.etiqueta, 'Opciones.etiqueta'),
    textoGenerado: requiredText(
      row.textoGenerado,
      'Opciones.textoGenerado',
    ),
    alarmaMinima: parseAlarmLevel(
      row.alarmaMinima,
      'Opciones.alarmaMinima',
    ),
    consejosIds: parseIdList(row.consejosIds),
    fuenteRef: optionalText(row.fuenteRef),
  }))

  const adviceRows = readSheet<Record<string, unknown>>(
    workbook,
    'Consejos',
  ).map<AdviceRow>((row) => ({
    id: requiredText(row.id, 'Consejos.id'),
    orden: parseNumber(row.orden, 'Consejos.orden'),
    titulo: requiredText(row.titulo, 'Consejos.titulo'),
    texto: requiredText(row.texto, 'Consejos.texto'),
    fuenteRef: optionalText(row.fuenteRef),
  }))

  const documentRows = readOptionalSheet<Record<string, unknown>>(
    workbook,
    'Documentos',
  ).map<DocumentRow>((row) => ({
    id: requiredText(row.id, 'Documentos.id'),
    orden: parseNumber(row.orden, 'Documentos.orden'),
    titulo: requiredText(row.titulo, 'Documentos.titulo'),
    tipo: parseDocumentType(row.tipo, 'Documentos.tipo'),
    destino: requiredText(row.destino, 'Documentos.destino'),
    fuenteRef: optionalText(row.fuenteRef),
  }))

  /* Lee una hoja opcional, devolviendo una lista vacía si no existe. */
  function readOptionalSheet<T>(
    workbook: ExcelJS.Workbook,
    sheetName: string,
  ): T[] {
    if (!workbook.getWorksheet(sheetName)) return []

    return readSheet<T>(workbook, sheetName)
  }

  assertUniqueIds(questionRows, 'pregunta')
  assertUniqueIds(optionRows, 'opción')
  assertUniqueIds(adviceRows, 'consejo')
  assertUniqueIds(documentRows, 'documento')

  const questionsById = new Map(questionRows.map((item) => [item.id, item]))
  const optionsById = new Map(optionRows.map((item) => [item.id, item]))
  const adviceIds = new Set(adviceRows.map((item) => item.id))

  for (const option of optionRows) {
    if (!questionsById.has(option.preguntaId)) {
      throw new Error(
        `La opción «${option.id}» apunta a la pregunta inexistente «${option.preguntaId}».`,
      )
    }

    for (const adviceId of option.consejosIds) {
      if (!adviceIds.has(adviceId)) {
        throw new Error(
          `La opción «${option.id}» apunta al consejo inexistente «${adviceId}».`,
        )
      }
    }
  }

  for (const question of questionRows) {
    const hasQuestionDependency = Boolean(question.dependeDePreguntaId)
    const hasOptionDependency = Boolean(question.dependeDeOpcionId)

    if (hasQuestionDependency !== hasOptionDependency) {
      throw new Error(
        `La pregunta «${question.id}» debe indicar conjuntamente dependeDePreguntaId y dependeDeOpcionId.`,
      )
    }

    if (question.dependeDePreguntaId && question.dependeDeOpcionId) {
      const dependencyOption = optionsById.get(question.dependeDeOpcionId)

      if (!questionsById.has(question.dependeDePreguntaId)) {
        throw new Error(
          `La pregunta «${question.id}» depende de una pregunta inexistente.`,
        )
      }

      if (
        !dependencyOption ||
        dependencyOption.preguntaId !== question.dependeDePreguntaId
      ) {
        throw new Error(
          `La dependencia de la pregunta «${question.id}» no coincide con su opción.`,
        )
      }
    }

    if (!optionRows.some((option) => option.preguntaId === question.id)) {
      throw new Error(`La pregunta «${question.id}» no tiene opciones.`)
    }
  }



  return {
    id: requiredText(metadata.get('id'), 'Metadatos.id'),
    title: requiredText(metadata.get('titulo'), 'Metadatos.titulo'),
    icon: requiredText(metadata.get('icono'), 'Metadatos.icono'),
    initialAlarmLevel: parseAlarmLevel(
      metadata.get('alarmaInicial'),
      'Metadatos.alarmaInicial',
    ),
    schemaVersion: parseNumber(
      metadata.get('versionEsquema'),
      'Metadatos.versionEsquema',
    ),
    questions: questionRows
      .sort((a, b) => a.orden - b.orden)
      .map((question) => ({
        id: question.id,
        order: question.orden,
        text: question.texto,
        required: question.obligatoria,
        ...(question.dependeDePreguntaId && question.dependeDeOpcionId
          ? {
            visibleWhen: {
              questionId: question.dependeDePreguntaId,
              optionId: question.dependeDeOpcionId,
            },
          }
          : {}),
        options: optionRows
          .filter((option) => option.preguntaId === question.id)
          .sort((a, b) => a.orden - b.orden)
          .map((option) => ({
            id: option.id,
            order: option.orden,
            label: option.etiqueta,
            transcriptText: option.textoGenerado,
            minimumAlarmLevel: option.alarmaMinima,
            adviceIds: option.consejosIds,
            ...(option.fuenteRef ? { source: option.fuenteRef } : {}),
          })),
        ...(question.fuenteRef ? { source: question.fuenteRef } : {}),
      })),
    advice: adviceRows
      .sort((a, b) => a.orden - b.orden)
      .map((item) => ({
        id: item.id,
        order: item.orden,
        title: item.titulo,
        text: item.texto,
        ...(item.fuenteRef ? { source: item.fuenteRef } : {}),
      })),
    documents: documentRows
      .sort((a, b) => a.orden - b.orden)
      .map((item) => ({
        id: item.id,
        order: item.orden,
        title: item.titulo,
        type: item.tipo,
        target: item.destino,
        ...(item.fuenteRef ? { source: item.fuenteRef } : {}),
      })),
  }
}

async function main(): Promise<void> {
  // Solo procesamos archivos Excel y lo hacemos en orden estable.
  const files = (await readdir(INPUT_DIRECTORY))
    .filter((fileName: string) => fileName.endsWith('.xlsx'))
    .sort()

  if (files.length === 0) {
    throw new Error(`No se encontraron archivos .xlsx en ${INPUT_DIRECTORY}.`)
  }

  await mkdir(OUTPUT_DIRECTORY, { recursive: true })

  // El catálogo se genera a partir de los propios Excel. No hay que mantenerlo
  // manualmente cuando se incorporen nuevas intervenciones.
  const catalog: InterventionSummary[] = []
  const interventionIds = new Set<string>()

  for (const fileName of files) {
    try {
      const intervention = await convertWorkbook(
        path.join(INPUT_DIRECTORY, fileName),
      )

      if (interventionIds.has(intervention.id)) {
        throw new Error(
          `El id de intervención «${intervention.id}» está repetido en otro Excel.`,
        )
      }

      interventionIds.add(intervention.id)
      catalog.push({
        id: intervention.id,
        title: intervention.title,
        icon: intervention.icon,
      })

      const outputPath = path.join(
        OUTPUT_DIRECTORY,
        `${intervention.id}.json`,
      )

      await writeFile(
        outputPath,
        `${JSON.stringify(intervention, null, 2)}\n`,
        'utf8',
      )

      console.log(`✓ ${fileName} → ${path.relative(process.cwd(), outputPath)}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw new Error(`Error en ${fileName}: ${message}`)
    }
  }

  // El panel inicial solo cargará este archivo ligero. Los datos completos de
  // cada intervención se cargarán después, cuando el usuario la seleccione.
  const catalogPath = path.join(OUTPUT_DIRECTORY, 'index.json')
  const sortedCatalog = catalog.sort((a, b) =>
    a.title.localeCompare(b.title, 'es'),
  )

  await writeFile(
    catalogPath,
    `${JSON.stringify(sortedCatalog, null, 2)}\n`,
    'utf8',
  )

  console.log(`✓ Catálogo → ${path.relative(process.cwd(), catalogPath)}`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})

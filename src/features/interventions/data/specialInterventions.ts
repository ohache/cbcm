export interface SpecialIntervention {
    id: string;
    title: string;
    documentPath: string;
}

export const specialInterventions: SpecialIntervention[] = [
  {
    id: 'aeropuerto-barajas',
    title: 'Aeropuerto Adolfo Suárez Madrid-Barajas',
    documentPath:
      'documentos/intervenciones-especiales/aeropuerto-barajas.pdf',
  },
]
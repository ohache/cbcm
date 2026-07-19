import { createBrowserRouter, Navigate } from 'react-router'
import { MainLayout } from '@/layouts/MainLayout'
import { InterventionsPage } from '@/features/interventions/pages/InterventionsPage'
import { InterventionsPanel } from '@/features/interventions/components/InterventionsPanel'
import { InterventionWorkspace } from '@/features/interventions/components/InterventionWorkSpace'

/* Enrutador principal de la aplicación */
export const router = createBrowserRouter([
  {
    element: <MainLayout />,

    children: [
      {
        index: true,
        element: <Navigate to="/interrogatorios" replace />,
      },
      {
        path: 'interrogatorios',
        element: <InterventionsPage />,

        children: [
          {
            index: true,
            element: <InterventionsPanel />,
          },
          {
            path: ':interventionId',
            element: <InterventionWorkspace />,
          },
        ],
      },
    ],
  },
])
import { Outlet } from 'react-router'
import { TopBar } from '@/components/layout/TopBar'

/* Estructura general de la aplicación */
export function MainLayout() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-slate-950">
      <TopBar />
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}
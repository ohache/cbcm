import { NavLink } from 'react-router'

/* Barra de navegación principal de la aplicación */
export function TopBar() {
  return (
    <header className="shrink-0 border-b border-white bg-slate-950">
      <div className="flex h-16 items-center px-6">
        <div className="mr-10">
          <p className="text-lg font-semibold text-white">
            Operador CBCM
          </p>
        </div>

        <nav
          className="flex h-full items-center gap-2"
          aria-label="Navegación principal"
        >
          <NavLink
            to="/interrogatorios"
            className={({ isActive }) => 'flex h-full items-center border-b-4 px-4 text-[17px] font-semibold transition-colors ' +
              (isActive ? 'border-cyan-700 text-cyan-700' : 'border-transparent text-slate-600 hover:text-slate-900')}
          >
            Interrogatorios
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
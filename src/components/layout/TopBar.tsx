import { NavLink } from 'react-router'

/* Barra de navegación principal de la aplicación */
export function TopBar() {
  return (
    <header className="shrink-0 border-b-2 border-slate-600 bg-slate-950">
      <div className="flex min-h-20 items-center px-6 py-3">
        <nav
          className="flex items-center gap-2"
          aria-label="Navegación principal"
        >
          <NavLink
            to="/interrogatorios"
            className={({ isActive }) => 'flex items-center rounded-md px-6 py-3 text-[17px] font-semibold transition-colors text-white ' +
              (isActive ? 'bg-slate-800' : 'border-transparent text-slate-600 hover:text-slate-900')}
          >
            Interrogatorios
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
import { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Package,
  Bell,
  ArrowLeftRight,
  LogOut
} from 'lucide-react'
import BrandLogo from './BrandLogo'
import authService from '../services/authService'
import './Layout.css'

interface LayoutProps {
  children: ReactNode
}

interface NavItem {
  path: string
  label: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { path: '/', label: 'Painel', icon: LayoutDashboard },
  { path: '/estoque', label: 'Estoque', icon: Package },
  { path: '/alerts', label: 'Alertas', icon: Bell },
  { path: '/movimentacoes', label: 'Movimentações', icon: ArrowLeftRight }
]

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    authService.logout()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="d-flex align-items-center gap-3 sidebar-brand">
          <BrandLogo size={40} />

          <div className="sidebar-brand-text">
            <h2>Varejo Local</h2>
            <span>Gestão de Varejo</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive =
              path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(path)

            return (
              <Link
                key={path}
                to={path}
                className={`sidebar-link${isActive ? ' active' : ''}`}
              >
                <Icon strokeWidth={2} />
                {label}
              </Link>
            )
          })}
        </nav>

        <button
          type="button"
          className="sidebar-logout"
          onClick={handleLogout}
          title="Sair do sistema"
          aria-label="Sair do sistema"
        >
          <LogOut strokeWidth={2} />
          Sair
        </button>
      </aside>

      <main className="app-main">{children}</main>
    </div>
  )
}

export default Layout
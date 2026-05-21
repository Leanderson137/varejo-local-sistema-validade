import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Bell,
  ArrowLeftRight,
  LogOut,
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import './Layout.css';

const navItems = [
  { path: '/', label: 'Painel', icon: LayoutDashboard },
  { path: '/estoque', label: 'Estoque', icon: Package },
  { path: '/alerts', label: 'Alertas', icon: Bell },
  { path: '/movimentacoes', label: 'Movimentações', icon: ArrowLeftRight },
];

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="sidebar-brand">
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
                : location.pathname.startsWith(path);
            return (
              <Link
                key={path}
                to={path}
                className={`sidebar-link${isActive ? ' active' : ''}`}
              >
                <Icon strokeWidth={2} />
                {label}
              </Link>
            );
          })}
        </nav>

        <button type="button" className="sidebar-logout" onClick={handleLogout}>
          <LogOut strokeWidth={2} />
          Sair
        </button>
      </aside>

      <div className="app-main">{children}</div>
    </div>
  );
};

export default Layout;

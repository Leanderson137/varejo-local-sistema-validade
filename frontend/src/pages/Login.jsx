import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <BrandLogo size={48} />
          <h1>Varejo Local</h1>
          <p>Acesse sua conta para gerenciar</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="email">E-mail</label>
            <div className="login-input-wrap">
              <Mail strokeWidth={2} />
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="password">Senha</label>
            <div className="login-input-wrap password">
              <Lock strokeWidth={2} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-toggle-pwd"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff strokeWidth={2} /> : <Eye strokeWidth={2} />}
              </button>
            </div>
          </div>

          <div className="login-options">
            <label className="login-remember">
              <input type="checkbox" />
              Lembrar-me
            </label>
            <a href="#" className="login-forgot" onClick={(e) => e.preventDefault()}>
              Esqueci minha senha
            </a>
          </div>

          <button type="submit" className="login-submit">
            Entrar
            <ArrowRight strokeWidth={2.5} />
          </button>
        </form>
      </div>

      <p className="login-footer">
        © 2024 EfficientLocal. Todos os direitos reservados.
      </p>
    </div>
  );
};

export default Login;

import { ChangeEvent, FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import BrandLogo from '../components/BrandLogo'
import authService from '../services/authService'
import './Login.css'

interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

const initialFormData: LoginFormData = {
  email: '',
  password: '',
  rememberMe: false
}

const Login = () => {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [formData, setFormData] = useState<LoginFormData>(initialFormData)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value, checked, type } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [id]: type === 'checkbox' ? checked : value
    }))

    if (errorMessage) {
      setErrorMessage('')
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      authService.login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      })

      navigate('/')
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Não foi possível realizar o login.'

      setErrorMessage(message)
    }
  }

  return (
    <main className="login-page d-flex flex-column align-items-center justify-content-center">
      <div className="card border-0 login-card">
        <div className="card-body p-0">
          <header className="text-center login-header">
            <BrandLogo size={48} />

            <h1>Varejo Local</h1>
            <p>Acesse sua conta para gerenciar</p>
          </header>

          {errorMessage && (
            <div className="alert alert-danger py-2 small" role="alert">
              {errorMessage}
            </div>
          )}

          <form className="d-flex flex-column gap-3 login-form" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="form-label login-label">
                E-mail
              </label>

              <div className="login-input-wrap">
                <Mail strokeWidth={2} />

                <input
                  id="email"
                  type="email"
                  className="form-control"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="form-label login-label">
                Senha
              </label>

              <div className="login-input-wrap password">
                <Lock strokeWidth={2} />

                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="login-toggle-pwd"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff strokeWidth={2} /> : <Eye strokeWidth={2} />}
                </button>
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-between gap-3 login-options">
              <label className="form-check d-flex align-items-center gap-2 m-0 login-remember">
                <input
                  id="rememberMe"
                  type="checkbox"
                  className="form-check-input m-0"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span>Lembrar-me</span>
              </label>

              <a
                href="#"
                className="login-forgot"
                onClick={(event) => event.preventDefault()}
              >
                Esqueci minha senha
              </a>
            </div>

            <button type="submit" className="btn login-submit">
              Entrar
              <ArrowRight strokeWidth={2.5} />
            </button>
          </form>
        </div>
      </div>

      <p className="login-footer">
        © 2024 EfficientLocal. Todos os direitos reservados.
      </p>
    </main>
  )
}

export default Login
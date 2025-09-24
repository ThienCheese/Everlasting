import { useState } from 'react'
import './login.css'
import { FaRegUserCircle } from "react-icons/fa";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { SiKeybase } from "react-icons/si";
export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const backendUrl = 'http://localhost:3000/api/v1/auth/login'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!email || !password) {
      setError('Vui lòng nhập email và mật khẩu')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        const msg = data && data.message ? data.message : `Lỗi: ${res.status}`
        setError(msg)
        setLoading(false)
        return
      }

      if (data && data.data && data.data.token) {
        localStorage.setItem('token', data.data.token)
        setSuccess('Đăng nhập thành công')
        setError(null)
        // small delay then redirect to home
        setTimeout(() => {
          window.location.href = '/'
        }, 700)
      } else {
        setError('Không nhận được token từ máy chủ')
      }
    } catch (err) {
      setError(err.message || 'Lỗi kết nối')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <header className="top-nav">
        <div className="top-nav-inner">
          <div className="brand">Everlasting</div>
          <nav>
            <a href="#about">About</a>
            <a href="#help">Help</a>
          </nav>
        </div>
      </header>

      <div className="login-container">
        <h2 className="login-title">Đăng nhập</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <div className="input-with-icon">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mine@gmail.com"
              className="form-input"
              required
            />
            <div className="input-icon"><FaRegUserCircle size={22} /></div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Mật khẩu</label>
          <div className="input-with-icon">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="form-input"
              required
            />
            <div className="input-icon"><SiKeybase size={22} /></div>
          </div>
        </div>

        <div className="button-row">
          <button type="submit" disabled={loading} className="btn">
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
          <button
            type="button"
            onClick={() => { setEmail(''); setPassword(''); setError(null); setSuccess(null); }}
            className="btn btn-secondary"
          >
            Xóa
          </button>
        </div>
      </form>

      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">{success}</div>}
      </div>

      <footer className="footer-contact">
        <div className="footer-inner">
          <div>Hỗ trợ: +84 123 456 789</div>
          <div>Email: support@everlasting.example</div>
          <div className="social-links">
            <a className="social-link" href="https://facebook.com/yourpage" target="_blank" rel="noreferrer">
              <FaFacebookF />
              <span className="sr-only">Facebook</span>
            </a>
            <a className="social-link" href="https://instagram.com/yourpage" target="_blank" rel="noreferrer">
              <FaInstagram />
              <span className="sr-only">Instagram</span>
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}

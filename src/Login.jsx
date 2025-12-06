import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

// Hardcoded credentials
const HARDCODED_USERNAME = 'admindata'
const HARDCODED_PASSWORD = 'data123'

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // ตรวจสอบ username และ password
    if (username === HARDCODED_USERNAME && password === HARDCODED_PASSWORD) {
      // เก็บสถานะการ login ใน localStorage
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('username', username)
      setLoading(false)
      onLogin(true)
    } else {
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
      setLoading(false)
    }
  }

  return (
    <div 
      className="d-flex justify-content-center align-items-center" 
      style={{ 
        width: '100vw',
        height: '100vh',
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
        margin: 0,
        boxSizing: 'border-box'
      }}
    >
      {/* Background decorative elements */}
      <div 
        style={{
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          zIndex: 0
        }}
      />
      <div 
        style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-10%',
          width: '500px',
          height: '500px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          zIndex: 0
        }}
      />

      <div 
        className="card shadow-lg border-0" 
        style={{ 
          width: '100%', 
          maxWidth: '480px',
          borderRadius: '20px',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1,
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(10px)'
        }}
      >
        {/* Header Section */}
        <div 
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '40px 30px',
            textAlign: 'center',
            color: 'white'
          }}
        >
          <div 
            style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 20px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            🔐
          </div>
          <h2 className="fw-bold mb-2" style={{ fontSize: '28px', margin: 0 }}>
            เข้าสู่ระบบ
          </h2>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
            ระบบจัดการสินค้า
          </p>
        </div>

        <div className="card-body p-5">
          {error && (
            <div 
              className="alert alert-danger d-flex align-items-center" 
              role="alert"
              style={{
                borderRadius: '12px',
                border: 'none',
                background: '#fee',
                color: '#c33',
                padding: '12px 16px',
                marginBottom: '24px',
                fontSize: '14px'
              }}
            >
              <span style={{ marginRight: '8px', fontSize: '18px' }}>⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label 
                htmlFor="username" 
                className="form-label fw-semibold"
                style={{ 
                  color: '#333',
                  marginBottom: '8px',
                  fontSize: '14px'
                }}
              >
                ชื่อผู้ใช้
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="กรุณากรอกชื่อผู้ใช้"
                  required
                  autoFocus
                  style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '2px solid #e0e0e0',
                    fontSize: '15px',
                    transition: 'all 0.3s ease',
                    background: '#fafafa'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea'
                    e.target.style.background = '#fff'
                    e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e0e0e0'
                    e.target.style.background = '#fafafa'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                <span 
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '18px',
                    color: '#999'
                  }}
                >
                  👤
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label 
                htmlFor="password" 
                className="form-label fw-semibold"
                style={{ 
                  color: '#333',
                  marginBottom: '8px',
                  fontSize: '14px'
                }}
              >
                รหัสผ่าน
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="กรุณากรอกรหัสผ่าน"
                  required
                  style={{
                    padding: '14px 50px 14px 16px',
                    borderRadius: '12px',
                    border: '2px solid #e0e0e0',
                    fontSize: '15px',
                    transition: 'all 0.3s ease',
                    background: '#fafafa'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea'
                    e.target.style.background = '#fff'
                    e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e0e0e0'
                    e.target.style.background = '#fafafa'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: '#999',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#667eea'}
                  onMouseLeave={(e) => e.target.style.color = '#999'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn w-100"
              disabled={loading}
              style={{
                padding: '14px',
                borderRadius: '12px',
                background: loading 
                  ? '#ccc' 
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: loading 
                  ? 'none' 
                  : '0 4px 15px rgba(102, 126, 234, 0.4)',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '8px'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)'
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)'
                }
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  กำลังเข้าสู่ระบบ...
                </>
              ) : (
                <>
                  <span style={{ marginRight: '8px' }}>🚀</span>
                  เข้าสู่ระบบ
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login


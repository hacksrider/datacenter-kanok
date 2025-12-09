import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

// Hardcoded credentials
const HARDCODED_ADMIN_USERNAME = 'admindata'
const HARDCODED_ADMIN_PASSWORD = 'data123'
const HARDCODED_USER_USERNAME = 'user'
const HARDCODED_USER_PASSWORD = 'user123'

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  // Initialize particles using lazy initializer to avoid setState in effect
  const [particles] = useState(() => 
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 10,
      size: 3 + Math.random() * 6
    }))
  )

  const handleSubmit = () => {
    setError('')
    setLoading(true)

    setTimeout(() => {
      // ตรวจสอบ admin
      if (username === HARDCODED_ADMIN_USERNAME && password === HARDCODED_ADMIN_PASSWORD) {
        onLogin(true, 'admin')
      } 
      // ตรวจสอบ user
      else if (username === HARDCODED_USER_USERNAME && password === HARDCODED_USER_PASSWORD) {
        onLogin(true, 'user')
      } 
      else {
        setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
        setLoading(false)
      }
    }, 1500)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && username && password && !loading) {
      handleSubmit()
    }
  }

  return (
    <div 
      style={{ 
        width: '100vw',
        height: '100vh',
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #A8E6CF 0%, #56C596 50%, #2D9B74 100%)',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(100vh) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-20px) translateX(20px) rotate(360deg); opacity: 0; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.15); opacity: 0.6; }
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes wave {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(-5deg); }
          75% { transform: translateY(-10px) rotate(5deg); }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.1); }
        }

        @keyframes logoFloat {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          25% { transform: translateY(-12px) rotate(-3deg) scale(1.05); }
          75% { transform: translateY(-12px) rotate(3deg) scale(1.05); }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px rgba(86, 197, 150, 0.5), 0 0 10px rgba(86, 197, 150, 0.3); }
          50% { box-shadow: 0 0 20px rgba(86, 197, 150, 0.8), 0 0 30px rgba(86, 197, 150, 0.5), 0 0 40px rgba(86, 197, 150, 0.3); }
        }

        @keyframes slideIn {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }

        .input-focus {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .input-focus:focus {
          transform: scale(1.02) translateY(-2px);
        }

        .input-focus::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 12px;
          background: linear-gradient(45deg, #56C596, #2D9B74, #56C596);
          opacity: 0;
          transition: opacity 0.3s;
          z-index: -1;
          background-size: 200% 200%;
        }

        .button-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .button-hover::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .button-hover:hover:not(:disabled)::before {
          width: 300px;
          height: 300px;
        }

        .button-hover:hover:not(:disabled) {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 10px 25px rgba(45, 155, 116, 0.5) !important;
        }

        .button-hover:active:not(:disabled) {
          transform: translateY(0) scale(0.98);
        }

        .card-container {
          animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .logo-container {
          animation: logoFloat 4s ease-in-out infinite;
        }

        .logo-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .leaf-icon {
          animation: wave 2.5s ease-in-out infinite;
          display: inline-block;
        }

        .shimmer-effect {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2.5s infinite;
        }

        .icon-bounce {
          animation: bounce 2s ease-in-out infinite;
        }

        .error-shake {
          animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97);
        }

        .gradient-bg {
          background: linear-gradient(135deg, #A8E6CF 0%, #56C596 50%, #2D9B74 100%);
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }

        .sparkle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          animation: sparkle 1.5s ease-in-out infinite;
        }

        @keyframes typingDot {
          0%, 20% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }

        .typing-dot {
          animation: typingDot 1.4s infinite;
        }

        @keyframes fadeInVideo {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .video-background {
          animation: fadeInVideo 2s ease-in;
        }
      `}</style>

      {/* Background Videos */}
      <video
        className="video-background"
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '36%',
          height: '90%',
          objectFit: 'cover',
          zIndex: 0,
          opacity: 1
        }}
      >
        <source src="/chaiyo.webm" type="video/webm" />
      </video>
      
      <video
        className="video-background"
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          right: '-1%',
          top: '10%',
          width: '40%',
          height: '80%',
          objectFit: 'cover',
          objectPosition: 'center',
          zIndex: 0,
          opacity: 1
        }}
      >
        <source src="/redhand.webm" type="video/webm" />
      </video>


      {/* Floating particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: `${particle.left}%`,
            bottom: 0,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '50%',
            animation: `float ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
            boxShadow: '0 0 8px rgba(255, 255, 255, 0.6)',
            zIndex: 0
          }}
        />
      ))}

      {/* Background decorative elements */}
      <div 
        style={{
          position: 'absolute',
          top: '5%',
          right: '10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(168, 230, 207, 0.4) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'pulse 8s ease-in-out infinite',
          zIndex: 0
        }}
      />
      <div 
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '10%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(86, 197, 150, 0.3) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'pulse 6s ease-in-out infinite',
          animationDelay: '1s',
          zIndex: 0
        }}
      />

      {/* Rotating rings */}
      <div 
        style={{
          position: 'absolute',
          top: '15%',
          left: '12%',
          width: '80px',
          height: '80px',
          border: '2px solid rgba(255, 255, 255, 0.25)',
          borderRadius: '50%',
          animation: 'rotate 20s linear infinite',
          zIndex: 0
        }}
      />
      <div 
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: '100px',
          height: '100px',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          animation: 'rotate 25s linear infinite reverse',
          zIndex: 0
        }}
      />

      <div 
        className="card shadow-lg border-0 card-container" 
        style={{ 
          width: '100%', 
          maxWidth: '420px',
          borderRadius: '20px',
          overflow: 'visible',
          position: 'relative',
          zIndex: 1,
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(15px)',
          boxShadow: '0 15px 40px rgba(45, 155, 116, 0.25)'
        }}
      >
        {/* Header Section with Logo */}
        <div 
          style={{
            background: 'linear-gradient(135deg, #56C596 0%, #2D9B74 100%)',
            padding: '35px 25px 30px',
            textAlign: 'center',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Shimmer effect overlay */}
          <div className="shimmer-effect" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none'
          }} />

          {/* Logo Container */}
          <div 
            className="logo-container"
            style={{
              width: '90px',
              height: '90px',
              margin: '0 auto 16px',
              background: 'white',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
              border: '3px solid rgba(255, 255, 255, 0.95)',
              position: 'relative',
              zIndex: 1
            }}
          >
            <img 
              src="/kanok-chaiyo.png" 
              alt="กนกส์โปรดักส์ จำกัด"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                padding: '8px'
              }}
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.parentElement.innerHTML = '<div style="font-size: 40px;">🌿</div>'
              }}
            />
          </div>

          <h1 className="fw-bold mb-1" style={{ 
            fontSize: '26px', 
            margin: 0,
            textShadow: '1px 1px 3px rgba(0,0,0,0.1)',
            letterSpacing: '0.5px'
          }}>
            Data Center Kanok
          </h1>
          <p style={{ 
            margin: '6px 0 0 0', 
            opacity: 0.95, 
            fontSize: '14px',
            fontWeight: '500'
          }}>
            บจก.กนกส์โปรดักส์
          </p>
          <div style={{
            marginTop: '10px',
            display: 'flex',
            justifyContent: 'center',
            gap: '6px'
          }}>
            <span className="leaf-icon" style={{ 
              fontSize: '20px',
              animationDelay: '0s'
            }}>🌿</span>
            <span className="leaf-icon" style={{ 
              fontSize: '20px',
              animationDelay: '0.2s'
            }}>🍃</span>
            <span className="leaf-icon" style={{ 
              fontSize: '20px',
              animationDelay: '0.4s'
            }}>🌱</span>
          </div>
        </div>

        <div className="card-body" style={{ padding: '30px' }}>
          {error && (
            <div 
              className="alert d-flex align-items-center" 
              role="alert"
              style={{
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
                color: '#c62828',
                padding: '12px 16px',
                marginBottom: '20px',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 3px 10px rgba(198, 40, 40, 0.12)',
                animation: 'fadeInUp 0.3s ease-out'
              }}
            >
              <span className="icon-bounce" style={{ marginRight: '10px', fontSize: '18px' }}>⚠️</span>
              {error}
            </div>
          )}

          <div>
            <div className="mb-3">
              <label 
                htmlFor="username" 
                className="form-label fw-semibold"
                style={{ 
                  color: '#2D9B74',
                  marginBottom: '8px',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span style={{ fontSize: '16px' }}>👤</span>
                ชื่อผู้ใช้
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-control input-focus"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="กรุณากรอกชื่อผู้ใช้"
                  autoFocus
                  style={{
                    padding: '12px 16px',
                    paddingRight: '45px',
                    borderRadius: '12px',
                    border: '2px solid #E0E0E0',
                    fontSize: '15px',
                    background: '#F8FFF9',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#56C596'
                    e.target.style.background = '#fff'
                    e.target.style.boxShadow = '0 0 0 3px rgba(86, 197, 150, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E0E0E0'
                    e.target.style.background = '#F8FFF9'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '18px',
                    color: username ? '#56C596' : '#ccc',
                    pointerEvents: 'none',
                    transition: 'color 0.3s'
                  }}
                >
                  ✓
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label 
                htmlFor="password" 
                className="form-label fw-semibold"
                style={{ 
                  color: '#2D9B74',
                  marginBottom: '8px',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span style={{ fontSize: '16px' }}>🔒</span>
                รหัสผ่าน
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control input-focus"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="กรุณากรอกรหัสผ่าน"
                  style={{
                    padding: '12px 16px',
                    paddingRight: '45px',
                    borderRadius: '12px',
                    border: '2px solid #E0E0E0',
                    fontSize: '15px',
                    background: '#F8FFF9',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#56C596'
                    e.target.style.background = '#fff'
                    e.target.style.boxShadow = '0 0 0 3px rgba(86, 197, 150, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E0E0E0'
                    e.target.style.background = '#F8FFF9'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '20px',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'transform 0.2s',
                    filter: 'grayscale(0.2)'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-50%) scale(1.1)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(-50%) scale(1)'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="btn w-100 button-hover"
              disabled={loading || !username || !password}
              style={{
                padding: '13px',
                borderRadius: '12px',
                background: (loading || !username || !password)
                  ? 'linear-gradient(135deg, #B0B0B0 0%, #808080 100%)' 
                  : 'linear-gradient(135deg, #56C596 0%, #2D9B74 100%)',
                border: 'none',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                boxShadow: (loading || !username || !password)
                  ? 'none' 
                  : '0 6px 18px rgba(45, 155, 116, 0.35)',
                cursor: (loading || !username || !password) ? 'not-allowed' : 'pointer',
                marginTop: '8px',
                letterSpacing: '0.3px'
              }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    border: '3px solid rgba(255,255,255,0.3)',
                    borderTop: '3px solid white',
                    borderRadius: '50%',
                    animation: 'rotate 1s linear infinite'
                  }} />
                  กำลังเข้าสู่ระบบ...
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>🚀</span>
                  เข้าสู่ระบบ
                </div>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Login
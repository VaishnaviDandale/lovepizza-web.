'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [msg, setMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg('')
    setIsLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMsg(error.message)
      setIsLoading(false)
    } else {
      setMsg('Logged in successfully!')
      setTimeout(() => {
        window.location.href = '/'
      }, 1000)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg('')
    setIsLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMsg(error.message)
      setIsLoading(false)
    } else {
      setMsg('Signup successful! Check your email.')
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        top: '-100px',
        left: '-100px',
        animation: 'float 6s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        bottom: '-50px',
        right: '-50px',
        animation: 'float 8s ease-in-out infinite',
        animationDelay: '1s',
      }} />

      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '420px',
        animation: 'slideInUp 0.8s ease',
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          animation: 'slideDown 0.8s ease',
        }}>
          <div style={{
            fontSize: '80px',
            marginBottom: '16px',
            animation: 'bounce 2s ease-in-out infinite',
            display: 'inline-block',
          }}>
            🍕
          </div>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            margin: '0 0 8px',
            background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            LovePizza
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#cbd5e1',
            margin: '0',
            opacity: 0.8,
          }}>
            Order delicious pizzas online
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
            padding: '40px 32px',
            borderRadius: '20px',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4)',
            animation: 'slideInUp 0.8s ease',
            animationDelay: '0.2s',
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              fontSize: '14px',
              color: '#e2e8f0',
              textTransform: 'uppercase',
            }}>
              📧 Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '2px solid #334155',
                backgroundColor: '#0b1220',
                color: 'white',
                outline: 'none',
                fontSize: '14px',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#22c55e'
                e.currentTarget.style.boxShadow = '0 0 15px rgba(34, 197, 94, 0.3)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#334155'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              fontSize: '14px',
              color: '#e2e8f0',
              textTransform: 'uppercase',
            }}>
              🔒 Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '2px solid #334155',
                backgroundColor: '#0b1220',
                color: 'white',
                outline: 'none',
                fontSize: '14px',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#22c55e'
                e.currentTarget.style.boxShadow = '0 0 15px rgba(34, 197, 94, 0.3)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#334155'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
            
            <label style={{
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '12px',
              cursor: 'pointer',
            }}>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                style={{
                  width: '16px',
                  height: '16px',
                  cursor: 'pointer',
                  accentColor: '#22c55e',
                }}
              />
              👁️ Show password
            </label>
          </div>

          {msg && (
            <div style={{
              padding: '12px 16px',
              marginBottom: '20px',
              borderRadius: '10px',
              fontSize: '14px',
              background: msg.includes('successfully') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: msg.includes('successfully') ? '#10b981' : '#ef4444',
              border: `1px solid ${msg.includes('successfully') ? '#10b981' : '#ef4444'}`,
            }}>
              {msg}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              background: isLoading ? '#64748b' : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              border: 'none',
              color: '#0f172a',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginBottom: '12px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(-2px)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            {isLoading ? '🔄 Logging in...' : '🚀 Login'}
          </button>

          <button
            type="button"
            onClick={handleSignup}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              background: 'transparent',
              border: '2px solid #3b82f6',
              color: '#3b82f6',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            {isLoading ? '⏳ Processing...' : '✨ Sign Up'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          fontSize: '13px',
          color: '#64748b',
        }}>
          🍕 Made with ❤️ for pizza lovers
        </p>
      </div>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  )
}

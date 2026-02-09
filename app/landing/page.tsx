'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Landing() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser()
      if (data?.user) {
        setIsLoggedIn(true)
      }
      setLoading(false)
    }
    checkAuth()
  }, [])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #334155', 
            borderTop: '4px solid #22c55e',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 1s linear infinite'
          }} />
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
          <p style={{ color: 'white', opacity: 0.7 }}>Loading...</p>
        </div>
      </div>
    )
  }

  if (isLoggedIn) {
    router.push('/')
    return null
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', overflow: 'hidden' }}>
      {/* Navigation */}
      <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#22c55e' }}>🍕 LovePizza</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => router.push('/login')}
            style={{
              padding: '10px 24px',
              borderRadius: '999px',
              border: '1px solid #22c55e',
              background: 'transparent',
              color: '#22c55e',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.95rem',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#22c55e'
              e.currentTarget.style.color = '#0f172a'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#22c55e'
            }}
          >
            Login
          </button>
          <button
            onClick={() => router.push('/login')}
            style={{
              padding: '10px 24px',
              borderRadius: '999px',
              background: '#22c55e',
              border: 'none',
              color: '#0f172a',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.95rem',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', padding: '80px 40px', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ animation: 'slideInLeft 0.8s ease' }}>
          <h2 style={{ fontSize: '56px', fontWeight: 'bold', marginBottom: '24px', lineHeight: '1.2' }}>
            Order Your Perfect Pizza
          </h2>
          <p style={{ fontSize: '18px', opacity: 0.8, marginBottom: '32px', lineHeight: '1.6' }}>
            Freshly made pizzas delivered to your doorstep. Choose from our delicious menu of Veg, Non-Veg, and Deluxe options with unlimited customization.
          </p>
          
          <div style={{ display: 'flex', gap: '16px', marginBottom: '48px' }}>
            <button
              onClick={() => router.push('/login')}
              style={{
                padding: '14px 40px',
                borderRadius: '999px',
                background: '#22c55e',
                border: 'none',
                color: '#0f172a',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(34, 197, 94, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              Order Now
            </button>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                padding: '14px 40px',
                borderRadius: '999px',
                border: '2px solid #22c55e',
                background: 'transparent',
                color: '#22c55e',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(34, 197, 94, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              Learn More
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            <div>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#22c55e' }}>500+</p>
              <p style={{ opacity: 0.7, fontSize: '14px' }}>Orders Served</p>
            </div>
            <div>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#22c55e' }}>30 min</p>
              <p style={{ opacity: 0.7, fontSize: '14px' }}>Avg. Delivery</p>
            </div>
            <div>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#22c55e' }}>4.8⭐</p>
              <p style={{ opacity: 0.7, fontSize: '14px' }}>Customer Rating</p>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div style={{ textAlign: 'center', animation: 'slideInRight 0.8s ease' }}>
          <div style={{
            fontSize: '200px',
            animation: 'float 3s ease-in-out infinite',
          }}>
            🍕
          </div>
          <p style={{ fontSize: '24px', marginTop: '24px', opacity: 0.7 }}>Fresh. Delicious. Fast.</p>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" style={{ padding: '80px 40px', background: 'rgba(255, 255, 255, 0.02)', marginTop: '60px' }}>
        <h3 style={{ fontSize: '40px', fontWeight: 'bold', textAlign: 'center', marginBottom: '60px' }}>Why Choose LovePizza?</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', maxWidth: '1200px', margin: '0 auto' }}>
          {[
            { icon: '🎨', title: 'Custom Pizza', desc: 'Build your pizza exactly how you like it with unlimited toppings.' },
            { icon: '⚡', title: 'Fast Delivery', desc: '30 minutes or less. We guarantee hot and fresh pizzas.' },
            { icon: '💳', title: 'Easy Payment', desc: 'Multiple payment options for your convenience.' },
            { icon: '📱', title: 'Track Orders', desc: 'Real-time order tracking from preparation to delivery.' },
            { icon: '🌟', title: 'Best Quality', desc: 'Premium ingredients and expert pizza makers.' },
            { icon: '🎉', title: 'Great Offers', desc: 'Exclusive deals and discounts for our loyal customers.' },
          ].map((feature, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '32px',
                borderRadius: '12px',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(34, 197, 94, 0.1)'
                e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.5)'
                e.currentTarget.style.transform = 'translateY(-8px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.2)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>{feature.icon}</div>
              <h4 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>{feature.title}</h4>
              <p style={{ opacity: 0.7, lineHeight: '1.6' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div style={{ padding: '80px 40px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '40px', fontWeight: 'bold', marginBottom: '24px' }}>Ready to Order?</h3>
        <p style={{ fontSize: '18px', opacity: 0.8, marginBottom: '32px' }}>Sign up now and get your first order ready!</p>
        <button
          onClick={() => router.push('/login')}
          style={{
            padding: '16px 48px',
            borderRadius: '999px',
            background: '#22c55e',
            border: 'none',
            color: '#0f172a',
            fontWeight: 'bold',
            fontSize: '18px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)'
            e.currentTarget.style.boxShadow = '0 15px 35px rgba(34, 197, 94, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          Get Started
        </button>
      </div>

      {/* Footer */}
      <footer style={{ padding: '40px', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.1)', opacity: 0.7 }}>
        <p>© 2026 LovePizza. All rights reserved. Made with ❤️</p>
      </footer>

      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
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
      `}</style>
    </div>
  )
}

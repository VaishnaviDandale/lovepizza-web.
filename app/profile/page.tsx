'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Order = {
  id: string
  pizza_type: string
  total: number
  created_at: string
  status: string
  paid: boolean
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    averageOrderValue: 0,
    lastOrderDate: null as string | null,
  })

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      const { data: authData, error: authError } = await supabase.auth.getUser()
      
      if (authError || !authData?.user) {
        router.push('/login')
        return
      }

      setUser(authData.user)

      // Fetch user's orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', authData.user.id)
        .order('created_at', { ascending: false })

      if (ordersData) {
        setOrders(ordersData as Order[])

        // Calculate stats
        const totalOrders = ordersData.length
        const totalSpent = ordersData.reduce((sum, order) => sum + order.total, 0)
        const averageOrderValue = totalOrders > 0 ? Math.round(totalSpent / totalOrders) : 0
        const lastOrderDate = totalOrders > 0 ? ordersData[0].created_at : null

        setStats({
          totalOrders,
          totalSpent,
          averageOrderValue,
          lastOrderDate,
        })
      }

      setLoading(false)
    }

    fetchUserData()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/landing')
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: 'white' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
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
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: 'white', padding: '20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>👤 My Profile</h1>
            <p style={{ opacity: 0.7 }}>Welcome back, {user.email}</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => router.push('/')}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: '1px solid #22c55e',
                background: 'transparent',
                color: '#22c55e',
                fontWeight: 'bold',
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
              Order Pizza
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: '#ef4444',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#dc2626'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ef4444'
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Account Details */}
        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '32px', borderRadius: '12px', marginBottom: '32px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>Account Information</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            <div>
              <p style={{ opacity: 0.7, marginBottom: '8px', fontSize: '14px' }}>Email Address</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{user.email}</p>
            </div>
            <div>
              <p style={{ opacity: 0.7, marginBottom: '8px', fontSize: '14px' }}>User ID</p>
              <p style={{ fontSize: '14px', fontFamily: 'monospace', color: '#94a3b8' }}>{user.id.slice(0, 12)}...</p>
            </div>
            <div>
              <p style={{ opacity: 0.7, marginBottom: '8px', fontSize: '14px' }}>Account Created</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{new Date(user.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
            <p style={{ opacity: 0.7, marginBottom: '8px', fontSize: '14px' }}>Total Orders</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#22c55e' }}>{stats.totalOrders}</p>
          </div>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <p style={{ opacity: 0.7, marginBottom: '8px', fontSize: '14px' }}>Total Spent</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>Rs. {stats.totalSpent}</p>
          </div>
          <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
            <p style={{ opacity: 0.7, marginBottom: '8px', fontSize: '14px' }}>Avg Order Value</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#a855f7' }}>Rs. {stats.averageOrderValue}</p>
          </div>
          <div style={{ background: 'rgba(249, 115, 22, 0.1)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(249, 115, 22, 0.3)' }}>
            <p style={{ opacity: 0.7, marginBottom: '8px', fontSize: '14px' }}>Last Order</p>
            <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#f97316' }}>
              {stats.lastOrderDate ? new Date(stats.lastOrderDate).toLocaleDateString() : 'No orders yet'}
            </p>
          </div>
        </div>

        {/* Order History */}
        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '32px', borderRadius: '12px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>Order History</h2>
          
          {orders.length === 0 ? (
            <p style={{ textAlign: 'center', opacity: 0.7, padding: '40px' }}>No orders yet. <span style={{ color: '#22c55e', cursor: 'pointer' }} onClick={() => router.push('/')}>Start ordering!</span></p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.08)', borderBottom: '1px solid rgba(148, 163, 184, 0.3)' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Date</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Pizza</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Amount</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.2)' }}>
                      <td style={{ padding: '12px', fontSize: '14px' }}>
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px' }}>{order.pizza_type}</td>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>Rs. {order.total}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          background: order.status === 'delivered' ? 'rgba(16, 185, 129, 0.2)' : order.status === 'cancelled' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                          color: order.status === 'delivered' ? '#10b981' : order.status === 'cancelled' ? '#ef4444' : '#fbbf24',
                        }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ color: order.paid ? '#22c55e' : '#ef4444', fontWeight: 'bold' }}>
                          {order.paid ? '✓ Paid' : '✗ Unpaid'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

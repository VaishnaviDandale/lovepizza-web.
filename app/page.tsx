'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { PizzaChoice, getBasePrice, calculateBill } from '@/lib/pizzaPricing'

type Order = {
  id: string
  pizza_type: string
  base_price: number
  extra_toppings: boolean
  extra_cheese: boolean
  takeaway: boolean
  total: number
  created_at: string
}

export default function Home() {
  const [choice, setChoice] = useState<PizzaChoice>('Veg')
  const [extraToppings, setExtraToppings] = useState(false)
  const [extraCheese, setExtraCheese] = useState(false)
  const [takeaway, setTakeaway] = useState(false)
  const [total, setTotal] = useState<number | null>(null)
  const [msg, setMsg] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)

  const fetchOrders = async () => {
    setLoadingOrders(true)
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (!error && data) {
      setOrders(data as Order[])
    } else {
      console.error('Error fetching orders', error)
    }
    setLoadingOrders(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleOrder = async () => {
    setMsg('')
    const basePrice = getBasePrice(choice)
    const bill = calculateBill(basePrice, extraToppings, extraCheese, takeaway)
    setTotal(bill)

    const { data, error } = await supabase.from('orders').insert([
      {
        pizza_type: choice,
        base_price: basePrice,
        extra_toppings: extraToppings,
        extra_cheese: extraCheese,
        takeaway,
        total: bill,
      },
    ])
    console.log('SUPABASE INSERT RESULT', { data, error })

    if (error) {
      console.error(error)
      setMsg('Error saving order')
    } else {
      setMsg('Order saved!')
      await fetchOrders()
    }
  }

  return (
    <div className="app-root">
      <div className="layout">
        <header className="header">
          <div>
            <h1 className="logo">LovePizza</h1>
            <p className="tagline">Order your custom pizza in a few clicks.</p>
          </div>
          <div className="badge">Student Project</div>
        </header>

        <div className="grid">
          <section className="card main-card">
            <h2 className="section-heading">Build your pizza</h2>
            <PizzaForm
              choice={choice}
              setChoice={setChoice}
              extraToppings={extraToppings}
              setExtraToppings={setExtraToppings}
              extraCheese={extraCheese}
              setExtraCheese={setExtraCheese}
              takeaway={takeaway}
              setTakeaway={setTakeaway}
              onOrder={handleOrder}
            />
            <OrderSummary total={total} msg={msg} />
          </section>

          <aside className="card side-card">
            <RecentOrders orders={orders} loading={loadingOrders} />
          </aside>
        </div>
      </div>
    </div>
  )
}

type PizzaFormProps = {
  choice: PizzaChoice
  setChoice: (v: PizzaChoice) => void
  extraToppings: boolean
  setExtraToppings: (v: boolean) => void
  extraCheese: boolean
  setExtraCheese: (v: boolean) => void
  takeaway: boolean
  setTakeaway: (v: boolean) => void
  onOrder: () => void
}

function PizzaForm(props: PizzaFormProps) {
  const {
    choice,
    setChoice,
    extraToppings,
    setExtraToppings,
    extraCheese,
    setExtraCheese,
    takeaway,
    setTakeaway,
    onOrder,
  } = props

  return (
    <>
      <div className="form-row">
        <span className="label">Pizza type</span>
        <select
          className="select"
          value={choice}
          onChange={e => setChoice(e.target.value as PizzaChoice)}
        >
          <option value="Veg">Veg Pizza (300)</option>
          <option value="NonVeg">Non-Veg Pizza (400)</option>
          <option value="DeluxeVeg">Deluxe Veg Pizza (550)</option>
          <option value="DeluxeNonVeg">Deluxe Non-Veg Pizza (650)</option>
        </select>
      </div>

      <div className="form-row">
        <span className="label">Extras</span>
        <div className="checkbox-row">
          <input
            type="checkbox"
            checked={extraToppings}
            onChange={e => setExtraToppings(e.target.checked)}
          />
          <span>Extra toppings (+150)</span>
        </div>
        <div className="checkbox-row">
          <input
            type="checkbox"
            checked={extraCheese}
            onChange={e => setExtraCheese(e.target.checked)}
          />
          <span>Extra cheese (+100)</span>
        </div>
        <div className="checkbox-row">
          <input
            type="checkbox"
            checked={takeaway}
            onChange={e => setTakeaway(e.target.checked)}
          />
          <span>Takeaway (+20)</span>
        </div>
      </div>

      <button onClick={onOrder} className="button-primary">
        <span>Place order</span>
      </button>
    </>
  )
}

type OrderSummaryProps = {
  total: number | null
  msg: string
}

function OrderSummary({ total, msg }: OrderSummaryProps) {
  return (
    <div className="summary">
      {total !== null && (
        <p className="bill-text">
          <span className="summary-label">Current total:</span> Rs. {total}
        </p>
      )}
      {msg && (
        <p className={msg === 'Order saved!' ? 'message-ok' : 'message-error'}>
          {msg}
        </p>
      )}
    </div>
  )
}

type RecentOrdersProps = {
  orders: Order[]
  loading: boolean
}

function RecentOrders({ orders, loading }: RecentOrdersProps) {
  return (
    <>
      <h2 className="section-heading">Recent orders</h2>
      {loading && <p className="bill-text">Loading orders...</p>}
      {!loading && orders.length === 0 && (
        <p className="bill-text">No orders yet.</p>
      )}
      {!loading && orders.length > 0 && (
        <ul className="orders-list">
          {orders.map(order => (
            <li key={order.id}>
              <span className="order-time">
                {new Date(order.created_at).toLocaleTimeString()}
              </span>
              <span className="order-type">{order.pizza_type}</span>
              <span className="order-total">Rs. {order.total}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

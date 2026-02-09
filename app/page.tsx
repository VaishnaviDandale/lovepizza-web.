'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { PizzaChoice, getBasePrice, calculateBill } from '@/lib/pizzaPricing';

type Order = {
  id: string;
  pizza_type: string;
  base_price: number;
  extra_toppings: boolean;
  extra_cheese: boolean;
  takeaway: boolean;
  total: number;
  created_at: string;
  user_id?: string;
  status: string;
  paid: boolean;
};

export default function Home() {
  const router = useRouter();
  const [choice, setChoice] = useState<PizzaChoice>('Veg');
  const [extraToppings, setExtraToppings] = useState(false);
  const [extraCheese, setExtraCheese] = useState(false);
  const [takeaway, setTakeaway] = useState(false);
  const [total, setTotal] = useState<number | null>(null);
  const [msg, setMsg] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Get current logged‑in user once
  useEffect(() => {
    const getUser = async () => {
      setLoadingUser(true);
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        setUserId(null);
        setUserEmail(null);
      } else {
        setUserId(data.user.id);
        setUserEmail(data.user.email ?? null);
      }
      setLoadingUser(false);
    };

    getUser();
  }, []);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!loadingUser && !userId) {
      router.push('/login');
    }
  }, [loadingUser, userId, router]);

  // Fetch orders only for this user
  const fetchOrders = async (uid: string) => {
    setLoadingOrders(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setOrders(data as Order[]);
    } else {
      console.error('Error fetching orders', error);
    }
    setLoadingOrders(false);
  };

  // When we know the userId, load their orders
  useEffect(() => {
    if (userId) {
      fetchOrders(userId);
    } else {
      setOrders([]);
    }
  }, [userId]);

  const handleOrder = async () => {
    setMsg('');

    if (!userId) {
      setMsg('Please login first to place an order.');
      return;
    }

    const basePrice = getBasePrice(choice);
    const bill = calculateBill(basePrice, extraToppings, extraCheese, takeaway);
    setTotal(bill);

    const { data, error } = await supabase.from('orders').insert([
      {
        pizza_type: choice,
        base_price: basePrice,
        extra_toppings: extraToppings,
        extra_cheese: extraCheese,
        takeaway,
        total: bill,
        user_id: userId,
        status: 'pending',
        paid: false,
      },
    ]);
    console.log('SUPABASE INSERT RESULT', { data, error });

    if (error) {
      console.error(error);
      setMsg('Error saving order');
    } else {
      setMsg('Order saved!');
      await fetchOrders(userId);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserId(null);
    setUserEmail(null);
    setOrders([]);
    setTotal(null);
    setMsg('Logged out.');
    router.push('/login');
  };

  return (
    <div className="app-root">
      <div className="layout">
        <header className="header">
          <div>
            <h1 className="logo">LovePizza</h1>
            <p className="tagline">Order your custom pizza in a few clicks.</p>
          </div>

          <div className="header-right">
            {userEmail ? (
              <div
                className="user-info"
                style={{ display: 'flex', gap: '12px', alignItems: 'center' }}
              >
                <span
                  className="user-email"
                  onClick={() => router.push('/profile')}
                  style={{
                    fontSize: '0.9rem',
                    opacity: 0.9,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.color = '#22c55e';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.opacity = '0.9';
                    e.currentTarget.style.color = 'white';
                  }}
                >
                  {userEmail}
                </span>
                <button
                  className="button-secondary"
                  onClick={handleLogout}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    border: '1px solid rgba(148,163,184,0.7)',
                    background: 'transparent',
                    color: 'white',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="badge">Student Project</div>
            )}
          </div>
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
            <RecentOrders
              orders={orders}
              loading={loadingOrders || loadingUser}
              userId={userId}
              onOrderCancel={() => userId && fetchOrders(userId)}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}

type PizzaFormProps = {
  choice: PizzaChoice;
  setChoice: (v: PizzaChoice) => void;
  extraToppings: boolean;
  setExtraToppings: (v: boolean) => void;
  extraCheese: boolean;
  setExtraCheese: (v: boolean) => void;
  takeaway: boolean;
  setTakeaway: (v: boolean) => void;
  onOrder: () => void;
};

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
  } = props;

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
  );
}

type OrderSummaryProps = {
  total: number | null;
  msg: string;
};

function OrderSummary({ total, msg }: OrderSummaryProps) {
  return (
    <div className="summary">
      {total !== null && (
        <p className="bill-text">
          <span className="summary-label">Current total:</span> Rs. {total}
        </p>
      )}
      {msg && (
        <p
          className={
            msg === 'Order saved!' || msg === 'Logged out.'
              ? 'message-ok'
              : 'message-error'
          }
        >
          {msg}
        </p>
      )}
    </div>
  );
}

type RecentOrdersProps = {
  orders: Order[];
  loading: boolean;
  userId: string | null;
  onOrderCancel: () => void;
};

function RecentOrders({ orders, loading, userId, onOrderCancel }: RecentOrdersProps) {
  const [cancelMsg, setCancelMsg] = useState('');
  const lastOrderTime =
    orders.length > 0 ? new Date(orders[0].created_at).toLocaleString() : null;

  const handleCancelOrder = async (orderId: string) => {
    setCancelMsg('Cancelling...');

    const { error } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', orderId);

    if (error) {
      setCancelMsg('Error: ' + error.message);
      setTimeout(() => setCancelMsg(''), 3000);
    } else {
      setCancelMsg('Order cancelled successfully!');
      setTimeout(() => setCancelMsg(''), 2000);
      setTimeout(() => onOrderCancel(), 1000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#fbbf24';
      case 'confirmed':
        return '#60a5fa';
      case 'preparing':
        return '#a78bfa';
      case 'ready':
        return '#34d399';
      case 'delivered':
        return '#10b981';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <>
      <h2 className="section-heading">Recent orders</h2>

      {cancelMsg && (
        <p
          style={{
            padding: '8px 12px',
            marginBottom: '12px',
            borderRadius: '4px',
            background: cancelMsg.includes('Error') ? '#fee2e2' : '#d1fae5',
            color: cancelMsg.includes('Error') ? '#991b1b' : '#065f46',
            fontSize: '0.9rem',
          }}
        >
          {cancelMsg}
        </p>
      )}

      {loading && <p className="bill-text">Loading orders...</p>}

      {!loading && !userId && (
        <p className="bill-text">Login to see your orders.</p>
      )}

      {!loading && userId && (
        <>
          {orders.length > 0 && (
            <div
              style={{
                marginBottom: '16px',
                paddingBottom: '12px',
                borderBottom: '1px solid rgba(148,163,184,0.3)',
              }}
            >
              <p className="bill-text" style={{ marginBottom: '6px' }}>
                <span style={{ fontWeight: 'bold' }}>Total orders:</span>{' '}
                {orders.length}
              </p>
              <p
                className="bill-text"
                style={{ fontSize: '0.85rem', opacity: 0.8 }}
              >
                <span style={{ fontWeight: 'bold' }}>Last order:</span>{' '}
                {lastOrderTime}
              </p>
            </div>
          )}

          {orders.length === 0 && (
            <p className="bill-text">No orders yet.</p>
          )}

          {orders.length > 0 && (
            <ul className="orders-list">
              {orders.map(order => (
                <li
                  key={order.id}
                  style={{
                    paddingBottom: '12px',
                    marginBottom: '12px',
                    borderBottom: '1px solid rgba(148,163,184,0.2)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      gap: '8px',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <span className="order-time">
                        {new Date(order.created_at).toLocaleTimeString()}
                      </span>
                      <span
                        className="order-type"
                        style={{ marginLeft: '8px' }}
                      >
                        {order.pizza_type}
                      </span>
                    </div>
                    <span className="order-total">Rs. {order.total}</span>
                  </div>

                  <div
                    style={{
                      marginTop: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.75rem',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: getStatusColor(order.status),
                        color: 'white',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                      }}
                    >
                      {order.status}
                    </span>

                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          style={{
                            fontSize: '0.75rem',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            background: '#ef4444',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                          }}
                        >
                          Cancel
                        </button>
                      )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </>
  );
}

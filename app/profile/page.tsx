'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Package, Clock, Loader2, User } from 'lucide-react';
import { formatPrice } from '@/lib/utils/helpers';

type TabIndex = 0 | 1;

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabIndex>(0);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { index: 0 as TabIndex, label: 'Account' },
    { index: 1 as TabIndex, label: 'My Orders' },
  ];

  if (status === 'loading' || loading) {
    return (
      <>
        <Navbar />
        <div className="content items-center justify-center">
          <Loader2 className="w-[3rem] h-[3rem] animate-spin text-heading" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="content justify-center">
        {/* Tab container — 700px centered with border */}
        <div
          className="w-full max-w-[70rem] mx-auto mt-[3rem] bg-white border border-border
                     animate-fade-in
                     max-xs:w-full max-xs:mt-[6rem]"
        >
          {/* Tab navigation */}
          <div className="bg-body-alt border-b border-border px-[3rem] max-xs:px-0">
            <ul className="flex m-0 p-0 relative -bottom-px">
              {tabs.map((tab) => (
                <li
                  key={tab.label}
                  role="presentation"
                  onClick={() => setActiveTab(tab.index)}
                  className={`
                    list-none py-[1.6rem] px-[1.6rem] text-[1.4rem]
                    border-b border-transparent inline-block
                    transition-all duration-300 ease-in-out cursor-pointer
                    hover:bg-body
                    ${
                      activeTab === tab.index
                        ? 'text-paragraph font-bold border-b-white bg-white hover:cursor-default hover:bg-white'
                        : 'text-subtle'
                    }
                  `}
                >
                  {tab.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Tab content */}
          <div className="p-[1.6rem] h-full max-xs:p-0">
            {activeTab === 0 && <AccountTab session={session} />}
            {activeTab === 1 && <OrdersTab orders={orders} />}
          </div>
        </div>
      </div>
    </>
  );
}

/* =============================================
   ACCOUNT TAB
   ============================================= */
function AccountTab({ session }: { session: any }) {
  return (
    <div className="flex mx-auto w-full max-xs:w-full">
      <div className="w-full h-auto">
        {/* Banner area */}
        <div className="w-full h-[15rem] relative max-xs:h-[10rem]">
          <div className="w-full h-full relative bg-border overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-[#101010] to-[#3a3a3a]" />
          </div>
          {/* Avatar */}
          <div
            className="w-[10rem] h-[10rem] rounded-full border-[3px] border-white
                       relative -mt-[5rem] ml-[1.6rem] bg-border overflow-hidden"
          >
            <div className="w-full h-full rounded-full bg-body-alt flex items-center justify-center">
              <User className="w-[4rem] h-[4rem] text-subtle" />
            </div>
          </div>
        </div>

        {/* Profile details */}
        <div className="pt-[6rem] px-[1.6rem] pb-[3rem]">
          <h2 className="text-heading text-[2.2rem] capitalize mb-[2rem]">
            {session?.user?.name || 'User'}
          </h2>

          <div className="mb-[1.2rem]">
            <span className="text-subtle text-[1.2rem]">Email</span>
            <br />
            <h5 className="text-heading text-[1.4rem] mt-[0.2rem]">
              {session?.user?.email || 'Not available'}
            </h5>
          </div>

          <div className="mb-[1.2rem]">
            <span className="text-subtle text-[1.2rem]">Address</span>
            <br />
            <h5 className="text-subtle italic text-[1.4rem] mt-[0.2rem]">
              Address not set
            </h5>
          </div>

          <div className="mb-[1.2rem]">
            <span className="text-subtle text-[1.2rem]">Mobile</span>
            <br />
            <h5 className="text-subtle italic text-[1.4rem] mt-[0.2rem]">
              Mobile not set
            </h5>
          </div>

          <div className="mb-[1.2rem]">
            <span className="text-subtle text-[1.2rem]">Date Joined</span>
            <br />
            <h5 className="text-subtle italic text-[1.4rem] mt-[0.2rem]">
              Not available
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============================================
   ORDERS TAB
   ============================================= */
function OrdersTab({ orders }: { orders: any[] }) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-[10rem]">
        <Package className="w-[6rem] h-[6rem] text-border mb-[2rem]" />
        <h3 className="text-heading text-[1.8rem] mb-[0.5rem]">My Orders</h3>
        <span className="text-subtle text-[1.4rem] font-bold">
          You don&apos;t have any orders
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-[1.6rem] py-[1.6rem]">
      {orders.map((order: any) => (
        <div
          key={order._id || order.id}
          className="border border-border p-[2rem] transition-all duration-300"
        >
          {/* Order header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-[1.6rem]">
            <div>
              <h3 className="text-heading text-[1.5rem] font-bold">
                Order #{(order._id || order.id || '').slice(-8)}
              </h3>
              <p className="text-subtle text-[1.2rem] flex items-center mt-[0.4rem]">
                <Clock className="w-[1.4rem] h-[1.4rem] mr-[0.4rem]" />
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="mt-[0.8rem] md:mt-0">
              <span
                className={`
                  inline-block px-[1.2rem] py-[0.4rem] text-[1.2rem] font-bold
                  ${
                    order.status === 'delivered'
                      ? 'bg-[#e8f5e9] text-[#2e7d32]'
                      : order.status === 'shipped'
                        ? 'bg-[#e3f2fd] text-[#1565c0]'
                        : order.status === 'processing'
                          ? 'bg-[#fff8e1] text-[#f57f17]'
                          : 'bg-body-alt text-paragraph'
                  }
                `}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Order items */}
          <div className="space-y-[0.8rem] mb-[1.6rem]">
            {order.items?.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between text-[1.3rem]">
                <span className="text-paragraph">
                  {item.productName || item.name} x {item.quantity}
                </span>
                <span className="text-heading font-bold">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
            {/* Prisma orderItems fallback */}
            {order.orderItems?.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between text-[1.3rem]">
                <span className="text-paragraph">
                  {item.name} x {item.quantity}
                </span>
                <span className="text-heading font-bold">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Order total */}
          <div className="border-t border-border pt-[1.2rem] flex justify-between items-center">
            <span className="text-heading text-[1.4rem] font-bold">Total</span>
            <span className="text-heading text-[1.6rem] font-bold">
              {formatPrice(order.totalPrice)}
            </span>
          </div>

          {/* Tracking number */}
          {order.trackingNumber && (
            <div className="mt-[1.2rem] bg-body-alt p-[1.2rem]">
              <p className="text-[1.2rem] text-paragraph">
                <strong>Tracking:</strong> {order.trackingNumber}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

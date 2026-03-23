'use client';

import { OrderQueryRes } from '@/lib/schema/order/order';
import Link from 'next/link';

interface Props {
  orders: OrderQueryRes[];
}

export default function OrderList({ orders }: Props) {
  if (orders.length === 0) {
    return <p className="text-center text-gray-500 py-8">주문 내역이 없습니다.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {orders.map((order) => (
        <Link 
          key={order.id} 
          href={`/orders/${order.id}`}
          className="block border rounded-lg p-4 hover:shadow-md transition bg-white"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="font-semibold">주문 #{order.id}</span>
            <span className="text-sm text-gray-500">
              {order.orderStatements[0]?.orderItems[0]?.createdAt?.toLocaleDateString('ko-KR')}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-2 truncate">{order.email}</p>
          
          <div className="space-y-1">
            {order.orderStatements.flatMap(stmt => 
              stmt.orderItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="truncate">{item.productItem.name}</span>
                  <span>{item.quantity}개</span>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-3 pt-3 border-t text-right font-bold">
            {order.orderStatements.reduce((total, stmt) => 
              total + stmt.orderItems.reduce((sum, item) => 
                sum + item.productItem.price * item.quantity, 0), 0).toLocaleString()}원
          </div>
        </Link>
      ))}
    </div>
  );
}
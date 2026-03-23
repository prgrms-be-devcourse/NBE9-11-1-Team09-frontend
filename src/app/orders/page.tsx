'use server';

import { getOrderList } from '@/lib/service/order';
import { Suspense } from 'react';
import OrderList from '../components/OrderList';

export default async function OrdersPage() {
  const orders = await getOrderList();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">주문 목록</h1>
      
      <Suspense fallback={<div className="text-center py-8">로딩 중...</div>}>
        <OrderList orders={orders} />
      </Suspense>
    </main>
  );
}
'use server';

import { getOrderList } from '@/lib/service/order';
import { Suspense } from 'react';
import OrderList from '../components/OrderList';
import Link from 'next/link';

export default async function OrdersPage() {
  const orders = await getOrderList();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold">주문 목록</h1>
        <Link
          href="/orders/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          새 주문 만들기
        </Link>
      </div>

      <Suspense fallback={<div className="text-center py-8">로딩 중...</div>}>
        <OrderList orders={orders} />
      </Suspense>
    </main>
  );
}
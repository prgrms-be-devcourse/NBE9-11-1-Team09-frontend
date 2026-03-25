'use server';

import OrderDetail from '@/app/components/OrderDetail';
import { getOrder } from '@/lib/service/order';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ orderId: string }>;
}

export default async function OrderDetailPage({ params }: Props) {
  const { orderId } = await params;
  const orderIdNum = parseInt(orderId, 10);
  
  if (isNaN(orderIdNum)) {
    notFound();
  }

  try {
    const order = await getOrder(orderIdNum);
    
    return (
      <main className="container mx-auto px-4 py-8">
        <OrderDetail order={order} />
      </main>
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Order Not Found') {
      notFound();
    }
    throw error;
  }
}
'use server';

import OrderDetail from '@/app/components/OrderDetail';
import { getOrder } from '@/lib/service/order';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const orderId = parseInt(id, 10);
  
  if (isNaN(orderId)) {
    notFound();
  }

  try {
    const order = await getOrder(orderId);
    
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
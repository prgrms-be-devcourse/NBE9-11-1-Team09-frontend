import OrderDetail from '@/app/components/OrderDetail';
import UpdateOrderForm from '@/app/components/UpdateOrderForm';
import { getOrder } from '@/lib/service/order';
import { getProductList } from '@/lib/service/product';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ 
    orderId: string; 
    statementId: string; 
  }>;
}

export default async function StatementEditPage({ params }: Props) {
  const { orderId, statementId } = await params;
  
  const orderIdNum = parseInt(orderId, 10);
  const statementIdNum = parseInt(statementId, 10);
    
  if (isNaN(orderIdNum) || isNaN(statementIdNum)) {
    notFound();
  }

  try {
    // 1. 주문 상세 데이터 조회
    const order = await getOrder(orderIdNum);
    
    // 2. 요청한 statementId 가 해당 주문에 실제로 존재하는지 검증
    const targetStatement = order.orderStatements.find(s => s.id === statementIdNum);
    if (!targetStatement) {
      notFound();
    }
    
    // 3. 상품 목록 조회
    const products = await getProductList();
    
    return (
      <UpdateOrderForm
        order={order} 
        initialProducts={products.items} 
        targetStatementId={statementIdNum}
      />
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Order Not Found') {
      notFound();
    }
    throw error;
  }
}
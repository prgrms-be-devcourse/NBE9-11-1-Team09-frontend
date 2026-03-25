// src/components/order/OrderUpdate.tsx
'use client';

import { useActionState, useRef, useEffect } from 'react';
import { updateOrderAction } from '@/lib/action/order';
import { OrderUpdateState, OrderQueryRes } from '@/lib/schema/order/order';
import ProductSelector from './ProductSelector';
import { ProductItem } from '@/lib/schema/product';

interface Props {
  order: OrderQueryRes;
  initialProducts: ProductItem[];
  targetStatementId: number; // 수정할 주문서 (Statement) 의 ID
}

const initialState: OrderUpdateState = {
  success: false,
  error: undefined,
  fieldErrors: undefined,
};

export default function UpdateOrderForm({ order, initialProducts, targetStatementId }: Props) {
  // 수정 대상 주문서 (Statement) 찾기
  const targetStatement = order.orderStatements.find(s => s.id === targetStatementId);

  // 데이터가 없으면 컴포넌트 렌더링 중단 (페이지 레벨에서 처리하는 것이 더 좋지만 안전장치 추가)
  if (!targetStatement) {
    return <div className="p-4 text-red-500">수정할 주문서 정보를 찾을 수 없습니다.</div>;
  }

  const [state, formAction, isPending] = useActionState(
    (prevState: OrderUpdateState, formData: FormData) => 
      updateOrderAction(order.id, targetStatementId, prevState, formData),
    initialState
  );

  const selectedItemsRef = useRef<Array<{ productId: number; quantity: number }>>([]);

  // 초기 선택된 상품 데이터를 Map 형태로 변환하여 ProductSelector 에 전달
  const initialSelectedItems = targetStatement.orderItems.map(item => ({
    productId: item.productItem.productId,
    quantity: item.quantity
  }));

  const handleSelectedItemsChange = (items: Array<{ productId: number; quantity: number }>) => {
    selectedItemsRef.current = items;
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    // 클라이언트 사이드 최종 검증: 상품이 하나도 선택되지 않은 경우
    if (selectedItemsRef.current.length === 0) {
      e.preventDefault();
      alert('최소 하나 이상의 제품을 선택해주세요');
      return;
    }
    // hidden input 에 선택된 상품 데이터 주입
    const hiddenInput = document.querySelector('input[name="orderItems"]') as HTMLInputElement;
    if (hiddenInput) {
      hiddenInput.value = JSON.stringify(selectedItemsRef.current);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">주문 수정하기</h1>

      <form 
        action={formAction} 
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-lg shadow"
      >
        {/* ✅ 이메일 (Read-only) */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            이메일
          </label>
          <div className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-600">
            {order.email}
          </div>
          <p className="text-xs text-gray-400 mt-1">이메일은 주문 생성 후 수정할 수 없습니다.</p>
          {/* 서버 전송용 hidden input (필요시) */}
          <input type="hidden" name="email" value={order.email} />
        </div>

        {/* 주소 (기존 데이터로 pre-fill) */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium mb-1">
            주소 *
          </label>
          <input
            type="text"
            id="address"
            name="address"
            defaultValue={targetStatement.address}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="서울시 강남구 ..."
            required
          />
          {state.fieldErrors?.address && (
            <p className="text-red-500 text-sm mt-1">{state.fieldErrors.address}</p>
          )}
        </div>

        {/* 우편번호 (기존 데이터로 pre-fill) */}
        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium mb-1">
            우편번호 *
          </label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            defaultValue={targetStatement.zipCode}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="06000"
            pattern="\d{5}"
            maxLength={5}
            required
          />
          {state.fieldErrors?.zipCode && (
            <p className="text-red-500 text-sm mt-1">{state.fieldErrors.zipCode}</p>
          )}
        </div>

        {/* ✅ 제품 선택 컴포넌트 (초기값 전달) */}
        <div className="border-t pt-6">
          <ProductSelector 
            initialProducts={initialProducts}
            onSelectedItemsChange={handleSelectedItemsChange}
            initialSelectedItems={initialSelectedItems} // 👈 기존 주문 항목을 초기값으로 설정
          />
          {state.fieldErrors?.orderItems && (
            <p className="text-red-500 text-sm mt-2">{state.fieldErrors.orderItems}</p>
          )}
        </div>

        <input type="hidden" name="orderItems" defaultValue={JSON.stringify(initialSelectedItems)} />

        {/* 전체 에러 메시지 */}
        {state.error && !state.fieldErrors && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {state.error}
          </div>
        )}

        {/* 제출 버튼 */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
          >
            {isPending ? '수정 중...' : '주문 수정하기'}
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700 font-medium"
          >
            취소
          </button>
        </div>
      </form>
    </main>
  );
}
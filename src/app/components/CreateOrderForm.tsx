'use client';

import { useActionState } from 'react';
import { createOrderAction } from '@/lib/action/order';
import { OrderCreateState } from '@/lib/schema/order/order';

const initialState: OrderCreateState = {
  success: false,
  error: undefined,
  fieldErrors: undefined,
};

export default function CreateOrderForm() {
  const [state, formAction, isPending] = useActionState(
    createOrderAction,
    initialState
  );

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">새 주문 만들기</h1>

      <form action={formAction} className="space-y-6 bg-white p-6 rounded-lg shadow">
        {/* 이메일 */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            이메일 *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="example@email.com"
            required
          />
          {state.fieldErrors?.email && (
            <p className="text-red-500 text-sm mt-1">{state.fieldErrors.email}</p>
          )}
        </div>

        {/* 주소 */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium mb-1">
            주소 *
          </label>
          <input
            type="text"
            id="address"
            name="address"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="서울시 강남구 ..."
            required
          />
          {state.fieldErrors?.address && (
            <p className="text-red-500 text-sm mt-1">{state.fieldErrors.address}</p>
          )}
        </div>

        {/* 우편번호 */}
        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium mb-1">
            우편번호 *
          </label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
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

        {/* 주문 상품 (숨김 필드로 전달) */}
        {/* 실제 구현에서는 상품 선택 UI 가 필요하며, 선택된 결과를 JSON 으로 변환하여 저장 */}
        <input
          type="hidden"
          name="orderItems"
          defaultValue={JSON.stringify([
            { productId: 1, quantity: 1 } // 예시 데이터 (실제론 상품 선택 UI 필요)
          ])}
        />

        {/* 전체 에러 메시지 */}
        {state.error && !state.fieldErrors && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {state.error}
          </div>
        )}

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isPending ? '처리 중...' : '주문하기'}
        </button>
      </form>
    </main>
  );
}
'use client';

import { deleteOrderAction } from "@/lib/action/order";
import { OrderDeleteState } from "@/lib/schema/order/order";
import { useActionState, useEffect, useRef } from "react";

interface Props {
    orderId: number;
    orderStatementId: number;
}

const initialState: OrderDeleteState = { success: false, error: undefined };

export default function DeleteOrderStatementButton({
    orderId,
    orderStatementId,
}: Props) {
    const [state, formAction, isPending] = useActionState(
        (prevState: OrderDeleteState) => 
            deleteOrderAction(orderId, orderStatementId, prevState),
        initialState
    );

    const handleClick = (e: React.MouseEvent) => {
        if (!confirm('해당 주문서를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
            e.preventDefault();
        }
    };

    return (
        <form action={formAction} className="inline">
            <button
                type="submit"
                onClick={handleClick}
                disabled={isPending}
                className="px-3 py-1.5 text-sm font-medium text-red-600 
                         bg-red-50 rounded hover:bg-red-100 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors"
            >
                {isPending ? '처리 중...' : '삭제'}
            </button>

            {/* 실패 시에만 에러 표시 (성공 시에는 리다이렉트되므로 불필요) */}
            {state?.error && (
                <div 
                    role="alert"
                    className="mt-2 p-2 text-xs text-red-700 bg-red-50 
                             border border-red-200 rounded"
                >
                    {state.error}
                </div>
            )}
        </form>
    );
}
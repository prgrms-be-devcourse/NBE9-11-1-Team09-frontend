'use server';

import { revalidatePath } from "next/cache";
import { OrderCreateReq, OrderCreateState, OrderDeleteState, OrderUpdateReq, OrderUpdateState } from "../schema/order/order";
import { createOrder, deleteOrder, updateOrder } from "../service/order";
import { redirect } from "next/navigation";

export async function createOrderAction(prevState: OrderCreateState, formData: FormData) {
    const email = formData.get('email') as string;
    const address = formData.get('address') as string;
    const zipCode = formData.get('zipCode') as string;

    const orderItemsJson = formData.get('orderItems') as string;
    let orderItems: Array<{ productId: number, quantity: number }> = [];

    try {
        orderItems = JSON.parse(orderItemsJson);
    } catch (e) {
        return {
            ...prevState,
            success: false,
            error: '상품 데이터가 올바르지 않습니다.',
            fieldErrors: { orderItems: '상품을 선택해주세요.' }
        };
    }

    if (!orderItems || orderItems.length === 0) {
        return {
            ...prevState,
            success: false,
            error: '주문할 제품을 선택해주세요',
            fieldErrors: { orderItems: '최소 하나 이상의 제품을 선택해야 합니다' }
        };
    }

    for (const item of orderItems) {
        if (!item.productId || item.productId <= 0) {
            return {
                ...prevState,
                success: false,
                error: '유효하지 않은 상품 ID 가 포함되었습니다',
            };
        }
        if (!item.quantity || item.quantity <= 0) {
            return {
                ...prevState,
                success: false,
                error: '상품 수량은 1 개 이상이어야 합니다',
            };
        }
    }

    const input = {
        email,
        orderStatements: {
            address,
            zipCode,
            orderItems
        }
    } satisfies OrderCreateReq;

    let result;

    try {
        result = await createOrder(input);
        if (!result.success) {
            return {
                ...prevState,
                success: false,
                error: result.error,
                fieldErrors: result.fieldErrors
            };
        }
    } catch (error) {
        return {
            ...prevState,
            success: false,
            error: error instanceof Error ? error.message : '주문 생성에 실패했습니다'
        }
    }

    revalidatePath('/orders');
    redirect(`/orders/${result.data!.orderId}`);
}

export async function updateOrderAction(id: number, prevState: OrderUpdateState, formData: FormData) {
    const email = formData.get('email') as string;
    const address = formData.get('address') as string;
    const zipCode = formData.get('zipCode') as string;

    const orderItemsJson = formData.get('orderItems') as string;
    let orderItems: Array<{ productId: number, quantity: number }> = [];

    try {
        orderItems = JSON.parse(orderItemsJson);
    } catch (e) {
        return {
            ...prevState,
            success: false,
            error: '상품 데이터가 올바르지 않습니다.',
            fieldErrors: { orderItems: '상품을 선택해주세요.' }
        };
    }

    const input = {
        email,
        orderStatements: {
            address,
            zipCode,
            orderItems
        }
    } satisfies OrderUpdateReq;

    let result;

    try {
        result = await updateOrder(id, input);

        if (!result.success) {
            return {
                ...prevState,
                error: result.error,
                fieldErrors: result.fieldErrors,
                success: false
            };
        }
    } catch (error) {
        return {
            ...prevState,
            success: false,
            error: error instanceof Error ? error.message : '주문 수정에 실패했습니다'
        };
    }

    revalidatePath('/order');
    revalidatePath(`/order/${id}`);
    redirect(`/order/${id}`);
}

export async function deleteOrderAction(
    orderId: number,
    orderStatementId: number,
    prevState: OrderDeleteState) {
    try {
        await deleteOrder(orderId, orderStatementId);
    } catch (error) {
        return {
            ...prevState,
            success: false,
            error: error instanceof Error ? error.message : "삭제 중 오류가 발생했습니다.",
        }
    }
    revalidatePath("/orders");
    revalidatePath(`/orders/${orderId}`);
    redirect("/orders");
}
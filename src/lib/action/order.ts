'use server';

import { revalidatePath } from "next/cache";
import { OrderCreateReq, OrderCreateState, OrderDeleteState, OrderUpdateReq, OrderUpdateState } from "../schema/order/order";
import { createOrder, deleteOrder, updateOrder } from "../service/order";
import { redirect } from "next/navigation";
import { success } from "zod";

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

    const input = {
        email,
        orderStatement: {
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

    revalidatePath('/order');
    redirect(`/order/${result.data!.orderId}`);
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
        orderStatement: {
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

export async function deleteOrderAction(id: number, prevState: OrderDeleteState) {
    try {
        await deleteOrder(id);
    } catch (error) {
        return {
            ...prevState,
            success: false,
            error: error instanceof Error ? error.message : "삭제 중 오류가 발생했습니다.",
        }
    }
    revalidatePath("/order");
    revalidatePath(`/order/${id}`);
    redirect("/order");
}
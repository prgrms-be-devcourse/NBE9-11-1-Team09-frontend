'use server';

import { OrderCreateReq, orderCreateReqSchema, orderCreateResSchema, OrderQueryRes, orderQueryResSchema, OrderUpdateReq, orderUpdateReqSchema, orderUpdateResSchema } from '../schema/order/order';
import { z } from 'zod';

// API_URL=http://localhost:8080/api/v1 insert to ".env(.local)"
const API_URL = process.env.API_URL;

export async function getOrderList(): Promise<OrderQueryRes[]> {
    const res = await fetch(`${API_URL}/order`, {
        next: { revalidate: 60 },
        headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch orders: ${res.status}`);
    }

    const data = await res.json();

    return z.array(orderQueryResSchema).parse(data);
}

export async function getOrder(id: number): Promise<OrderQueryRes> {
    const res = await fetch(`${API_URL}/order/${id}`, {
        next: { revalidate: 60 },
        headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
        if (res.status == 404) throw new Error('Order Not Found');
        throw new Error(`Failed to fetch order id ${id} : ${res.status}`);
    }

    const data = await res.json();

    return orderQueryResSchema.parse(data);
}

export async function createOrder(input: OrderCreateReq) {
    const validated = orderCreateReqSchema.safeParse(input);

    if (!validated.success) {
        const fieldErrors = validated.error.issues.reduce((acc, issue) => {

            const field = issue.path.join('.');
            acc[field] = issue.message;
            return acc;
        }, {} as Record<string, string>);

        return {
            success: false,
            error: '입력값을 확인해주세요.',
            fieldErrors
        }

    }

    try {
        const res = await fetch(`${API_URL}/order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validated.data)
        });

        if (!res.ok) {
            throw new Error(`Failed to create order: ${res.status}`);
        }

        const response = await res.json();

        const apiResponse = orderCreateResSchema.parse(response);
        if (!apiResponse.success) {
            throw new Error(apiResponse.message);
        }
        return { success: true, data: apiResponse.data };

    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : '주문 생성에 실패했습니다'
        };
    }
}

export async function updateOrder(id: number, input: OrderUpdateReq) {
    const validated = orderUpdateReqSchema.safeParse(input);

    if (!validated.success) {
        const fieldErrors = validated.error.issues.reduce((acc, issue) => {

            const field = issue.path.join('.');
            acc[field] = issue.message;
            return acc;
        }, {} as Record<string, string>);

        return {
            success: false,
            error: '입력값을 확인해주세요.',
            fieldErrors
        }

    }

    try {
        const res = await fetch(`${API_URL}/order/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validated.data)
        });

        if (!res.ok) {
            throw new Error(`Failed to update order: ${res.status}`);
        }

        const response = await res.json();

        const apiResponse = orderCreateResSchema.parse(response);

        if (!apiResponse.success) {
            throw new Error(apiResponse.message);
        }
        return { success: true, data: apiResponse.data };

    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : '주문 수정에 실패했습니다'
        };
    }
}

export async function deleteOrder(orderId: number, orderStatementId: number) {
    const res = await fetch(`${API_URL}/order/${orderId}/statement/${orderStatementId}`, {
        method: 'DELETE',
    });

    if (!res.ok) {
        throw new Error(`Failed to delete order: ${res.status}`);
    }
}
import { z } from 'zod';
import { orderItemReqSchema, orderItemResSchema } from './orderItem';

export const orderStatementReqSchema = z.object({
    address: z.string().min(1, "주소는 한 글자 이상이여야 합니다."),
    zipCode: z.string()
        .length(5, "우편번호는 5 자리 숫자여야 합니다.")
        .regex(/^\d{5}$/, "숫자만 입력 가능합니다."),
    orderItems: z.array(orderItemReqSchema)
});

export const orderStatementResSchema = z.object({
    id: z.number().int().positive(),
    address: z.string().min(1, "주소는 한 글자 이상이여야 합니다."),
    zipCode: z.string(),
    orderItems: z.array(orderItemResSchema)
});

export type OrderStatementReq = z.infer<typeof orderStatementReqSchema>;
export type OrderStatementRes = z.infer<typeof orderStatementResSchema>;
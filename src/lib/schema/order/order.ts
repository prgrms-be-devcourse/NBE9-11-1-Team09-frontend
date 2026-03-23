import { z } from 'zod';
import { orderStatementReqSchema, orderStatementResSchema } from './orderStatement';
import { ApiResponseSchema } from '../common';

export const orderCreateReqSchema = z.object({
    email: z.email(),
    orderStatement: orderStatementReqSchema
});

export const orderCreateResSchema = ApiResponseSchema(z.object({
    orderId: z.number().int().positive(),
    email: z.email(),
    createdAt: z.coerce.date()
}));

export const orderQueryResSchema = z.object({
    id: z.number().int().positive(),
    email: z.email(),
    orderStatements: z.array(orderStatementResSchema)
});

export const orderUpdateReqSchema = orderCreateReqSchema;

export const orderUpdateResSchema = orderCreateResSchema;

export type OrderCreateReq = z.infer<typeof orderCreateReqSchema>;
export type OrderCreateRes = z.infer<typeof orderCreateResSchema>;
export type OrderQueryRes = z.infer<typeof orderQueryResSchema>;
export type OrderUpdateReq = z.infer<typeof orderUpdateReqSchema>;
export type OrderUpdateRes = z.infer<typeof orderUpdateResSchema>;
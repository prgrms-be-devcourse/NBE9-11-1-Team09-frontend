import { z } from 'zod';
import { productItemSchema } from '../product';

export const orderItemReqSchema = z.object({
    id: z.number().int().positive(),
    productId : z.number().int().positive(),
    quantity: z.number().int().positive(),
});

export const orderItemResSchema = z.object({
    id: z.number().int().positive(),
    productItem: productItemSchema,
    quantity: z.number().int().nonnegative(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date()
});

export type OrderItemReq = z.infer<typeof orderItemReqSchema>;
export type OrderItemRes = z.infer<typeof orderItemResSchema>;

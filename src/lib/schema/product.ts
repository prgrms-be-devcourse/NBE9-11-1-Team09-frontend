import {z} from 'zod';

export const productItemSchema = z.object({
    productId: z.number().int().positive(),
    name: z.string().min(1, '제품 이름은 필수입니다.'),
    price: z.number().int().positive(),
    imageSeq: z.number().int().positive()
});

export type ProductItem = z.infer<typeof productItemSchema>;
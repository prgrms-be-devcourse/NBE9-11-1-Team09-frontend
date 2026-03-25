import {z} from 'zod';

export const productItemSchema = z.object({
    productId: z.number().int().positive(),
    name: z.string().min(1, '제품 이름은 필수입니다.'),
    price: z.number().int().positive(),
    imageSeq: z.number().int().positive()
});

export const productListSchema = z.object({
    items: z.array(productItemSchema)
})

export type ProductItem = z.infer<typeof productItemSchema>;
export type ProductList = z.infer<typeof productListSchema>;
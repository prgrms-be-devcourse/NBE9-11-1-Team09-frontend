import { ProductList, productListSchema } from "../schema/product";

const API_URL = process.env.API_URL;

export async function getProductList(): Promise<ProductList> {
    const res = await fetch(`${API_URL}/product`, {
        next: { revalidate: 60 },
        headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.status}`);
    }

    const data = await res.json();

    return productListSchema.parse(data);
}
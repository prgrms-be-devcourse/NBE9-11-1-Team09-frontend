'use server';

import CreateOrderForm from "@/app/components/CreateOrderForm";
import { getProductList } from "@/lib/service/product";

export default async function OrderCreatePage() {
    const products = await getProductList();

    return <CreateOrderForm initialProducts={products.items}/>;
}
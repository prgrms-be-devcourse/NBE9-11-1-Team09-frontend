'use client';

import { OrderQueryRes } from '@/lib/schema/order/order';
import { getProductImageSrc } from '@/lib/util/image-load';
import Image from 'next/image';
import DeleteOrderStatementButton from './DeleteOrderStatementButton';

interface Props {
    order: OrderQueryRes;
}

export default function OrderDetail({ order }: Props) {
    // 총 금액 계산
    const totalAmount = order.orderStatements.reduce((total, stmt) =>
        total + stmt.orderItems.reduce((sum, item) =>
            sum + item.productItem.price * item.quantity, 0), 0);

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
                <h1 className="text-2xl font-bold">주문 #{order.id} 상세</h1>

                {order.orderStatements.map((statement) => (
                    <div key={statement.id} className="border rounded-lg p-4 bg-white relative">
                        <div className="absolute top-3 right-3">
                            <DeleteOrderStatementButton
                                orderId={order.id}
                                orderStatementId={statement.id}
                            />
                        </div>
                        
                        <div className="mb-4 pb-4 border-b">
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">배송지:</span> {statement.address}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">우편번호:</span> {statement.zipCode}
                            </p>
                        </div>

                        <div className="space-y-3">
                            {statement.orderItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-4 p-3 border rounded hover:bg-gray-50"
                                >
                                    <div className="relative w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                        <Image
                                            src={getProductImageSrc(item.productItem.imageSeq)}
                                            alt={item.productItem.name}
                                            fill
                                            className="object-cover"
                                            sizes="80px"
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium truncate">{item.productItem.name}</h3>
                                        <p className="text-sm text-gray-500">
                                            {item.productItem.price.toLocaleString()}원
                                        </p>
                                        <p className="text-sm mt-1">
                                            수량: <span className="font-semibold">{item.quantity}개</span>
                                        </p>
                                    </div>

                                    <div className="text-right font-bold self-center">
                                        {(item.productItem.price * item.quantity).toLocaleString()}원
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <aside className="lg:col-span-1">
                <div className="sticky top-8 border rounded-lg p-4 bg-white">
                    <h2 className="font-bold text-lg mb-4">주문 요약</h2>

                    <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                        {order.orderStatements.flatMap(stmt =>
                            stmt.orderItems.map(item => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span className="truncate">{item.productItem.name}</span>
                                    <span>{item.quantity}개</span>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="border-t pt-4 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">이메일</span>
                            <span className="font-medium">{order.email}</span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">배송 안내</span>
                            <span className="text-xs text-gray-500 text-right">
                                당일 오후 2시 이후의 주문은<br />다음날 배송을 시작합니다.
                            </span>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t">
                            <span className="font-bold">총 금액</span>
                            <span className="text-xl font-bold text-red-600">
                                {totalAmount.toLocaleString()}원
                            </span>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
}
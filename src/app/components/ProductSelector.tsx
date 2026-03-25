// src/components/order/ProductSelector.tsx
'use client';

import { useEffect, useState } from 'react';
import { getProductImageSrc } from '@/lib/util/image-load';
import Image from 'next/image';
import { ProductItem } from '@/lib/schema/product';

interface Props {
    /** 서버에서 전달받은 제품 목록 (읽기 전용) */
    initialProducts: ProductItem[];
    /** 선택된 상품 목록이 변경될 때 호출 */
    onSelectedItemsChange: (items: Array<{ productId: number; quantity: number }>) => void;
    /** 초기 선택값 (수정 모드용) */
    initialSelectedItems?: Array<{ productId: number; quantity: number }>;
  }

  export default function ProductSelector({ 
    initialProducts, 
  onSelectedItemsChange,
  initialSelectedItems = [] 
}: Props) {
  const [selectedItems, setSelectedItems] = useState<Map<number, number>>(() => {
    const map = new Map<number, number>();
    for (const item of initialSelectedItems) {
      map.set(item.productId, item.quantity);
    }
    return map;
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      const items = Array.from(selectedItems.entries()).map(([productId, quantity]) => ({
        productId,
        quantity,
      }));
      onSelectedItemsChange(items);
    }, 100);
    return () => clearTimeout(timer);
  }, [selectedItems, onSelectedItemsChange]);

  const toggleSelect = (productId: number) => {
    setSelectedItems(prev => {
      const next = new Map(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.set(productId, 1);
      }
      return next;
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setSelectedItems(prev => {
      const next = new Map(prev);
      const current = next.get(productId) ?? 1;
      next.set(productId, Math.max(1, current + delta));
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">주문할 제품 선택 *</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {initialProducts.map(product => {
            const isSelected = selectedItems.has(product.productId);
            const quantity = selectedItems.get(product.productId) ?? 1;
            
            return (
              <div
                key={product.productId}
                className={`
                  relative p-3 border rounded-lg cursor-pointer transition
                  ${isSelected 
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
                `}
                onClick={() => toggleSelect(product.productId)}
              >
                {isSelected && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                    ✓
                  </span>
                )}
                
                <div className="flex gap-3">
                  <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={getProductImageSrc(product.imageSeq, product.name)}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      {product.price.toLocaleString()}원
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div 
                    className="absolute bottom-2 right-2 flex items-center gap-1"
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.productId, -1)}
                      className="w-7 h-7 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center justify-center text-sm font-medium disabled:opacity-50"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-medium">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.productId, 1)}
                      className="w-7 h-7 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center justify-center text-sm font-medium disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedItems.size > 0 && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">선택한 제품</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {Array.from(selectedItems.entries()).map(([productId, quantity]) => {
              const product = initialProducts.find(p => p.productId === productId);
              if (!product) return null;
              
              return (
                <div key={productId} className="flex justify-between items-center text-sm">
                  <span className="truncate">{product.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">
                      {quantity}개 × {product.price.toLocaleString()}원
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleSelect(productId)}
                      className="text-red-500 hover:text-red-700 text-xs underline"
                    >
                      제거
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t text-right font-bold">
            총액:{' '}
            {Array.from(selectedItems.entries())
              .reduce((sum, [productId, qty]) => {
                const p = initialProducts.find(x => x.productId === productId);
                return sum + (p?.price ?? 0) * qty;
              }, 0)
              .toLocaleString()}원
          </div>
        </div>
      )}
    </div>
  );
}
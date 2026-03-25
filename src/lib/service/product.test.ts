// src/lib/api/product.test.ts
import { getProductList } from './product';

// ✅ fetch 전역 모킹 (Node 환경용)
global.fetch = jest.fn();

describe('getProductList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.API_URL = 'http://localhost:8080/api/v1';
  });

  it('✅ 성공: 유효한 데이터 파싱 및 반환', async () => {
    // given
    const mockResponse = {
      items: [
        { productId: 1, name: '아메리카노', price: 4500, imageSeq: 1 },
      ],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    // when
    const result = await getProductList();

    // then
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/v1/product',
      expect.objectContaining({
        headers: { 'Content-Type': 'application/json' },
      })
    );
    
    expect(result.items).toHaveLength(1);
    expect(result.items[0].name).toBe('아메리카노');
  });
});
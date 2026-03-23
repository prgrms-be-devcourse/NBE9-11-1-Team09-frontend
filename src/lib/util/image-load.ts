/**
 * 제품 이미지 경로를 반환합니다.
 * 파일이 없는 경우 SVG 플레이스홀더를 데이터 URI 로 반환합니다.
 */
export function getProductImageSrc(imageSeq: number, name: string = 'Product'): string {
    // 1. 실제 이미지 매핑 (파일이 있다면 사용)
    const imageMap: Record<number, string> = {
      1: '/coffee/product-1.jpg',
      2: '/coffee/product-2.jpg',
      3: '/coffee/product-3.jpg',
      4: '/coffee/product-4.webp',
    };
  
    const mappedSrc = imageMap[imageSeq];
  
    // 2. 매핑된 파일이 있다면 해당 경로 반환
    if (mappedSrc) {
      return mappedSrc;
    }
  
    // 3. 파일이 없다면 SVG 플레이스홀더 반환 (저작권 안전)
    // 제품 이름의 이니셜과 시퀀스에 따라 색상을 다르게 표시
    return getPlaceholderSVG(imageSeq, name);
  }
  
  /**
   * SVG 플레이스홀더를 데이터 URI 로 생성합니다.
   */
  function getPlaceholderSVG(imageSeq: number, name: string): string {
    const initial = name.charAt(0).toUpperCase();
    
    // 시퀀스에 따라 배경색 변경 (1~4 번 제품 구분)
    const colors = [
      { bg: '#fef3c7', text: '#d97706' }, // Amber
      { bg: '#d1fae5', text: '#059669' }, // Emerald
      { bg: '#dbeafe', text: '#2563eb' }, // Blue
      { bg: '#fce7f3', text: '#db2777' }, // Rose
    ];
    
    const color = colors[(imageSeq - 1) % colors.length];
    
    // SVG 문자열 생성 (초기 표시 + 테두리)
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
        <rect width="80" height="80" rx="8" fill="${color.bg}"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
              font-size="32" font-weight="bold" fill="${color.text}" 
              font-family="sans-serif">${initial}</text>
      </svg>
    `.trim();
  
    // 데이터 URI 인코딩
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }
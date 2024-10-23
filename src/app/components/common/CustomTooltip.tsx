import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}

interface TooltipPosition {
  top: number;
  left: number;
}

export default function CustomTooltip({children, content, className = ''}: TooltipProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [position, setPosition] = useState<TooltipPosition>({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  
  const updateTooltipPosition = (): void => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    // 기본 위치 계산 (오른쪽 배치)
    const top = triggerRect.top + (triggerRect.height / 2);
    let left = triggerRect.right + 12; // 12px 간격

    // 오른쪽 공간이 부족한 경우 왼쪽에 배치
    if (left + tooltipRect.width > viewportWidth - 12) {
      left = triggerRect.left - tooltipRect.width - 12;
    }

    setPosition({
      top,
      left,
    });
  };

  // 디바운스 함수
  const debounce = <T extends (...args: unknown[]) => void>(
    fn: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  };

  useEffect(() => {
    if (!isVisible) return;

    // 디바운스된 업데이트 함수
    const debouncedUpdate = debounce(updateTooltipPosition, 100);

    // RAF를 사용한 초기 위치 설정
    requestAnimationFrame(updateTooltipPosition);

    // 이벤트 리스너
    window.addEventListener('scroll', debouncedUpdate, { passive: true });
    window.addEventListener('resize', debouncedUpdate, { passive: true });

    return () => {
      window.removeEventListener('scroll', debouncedUpdate);
      window.removeEventListener('resize', debouncedUpdate);
    };
  }, [isVisible]);

  const handleMouseEnter = (): void => {
    setIsVisible(true);
    requestAnimationFrame(updateTooltipPosition);
  };

  const handleMouseLeave = (): void => {
    setIsVisible(false);
  };
  
  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={className}
      >
        {children}
      </div>
      {isVisible &&
        createPortal(
          <div
            ref={tooltipRef}
            className="fixed z-50 px-2 py-1 text-sm bg-base-200 rounded shadow-lg whitespace-normal max-w-xs"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              transform: 'translateY(-50%)',
              transition: 'opacity 0.15s ease-in-out',
              opacity: tooltipRef.current ? 1 : 0,
            }}
            role="tooltip"
            aria-live="polite"
          >
            {content}
          </div>,
          document.body
        )}
    </>
  )
}

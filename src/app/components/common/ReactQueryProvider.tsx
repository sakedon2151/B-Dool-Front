'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, ReactNode } from 'react'

// React-Query 전역 설정 컴포넌트

export default function ReactQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 10 * 1000, // 10초
        gcTime: 30 * 1000, // 30초
        
        refetchOnWindowFocus: true, // 윈도우 포커스시 자동 리패치 - 권장은 false 및 sse, websocket 처리 
        refetchOnReconnect: true, // 네트워크 재연결시 리패치
        refetchOnMount: "always",
        
        retry: 1, // 실패시 1번만 재시도
        retryDelay: 1000, // 재시도 사이 1초 대기
      },
      mutations: {
        retry: 1, // mutation도 실패시 1번만 재시도
        retryDelay: 1000,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
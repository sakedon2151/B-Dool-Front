"use client"
import CommonFooter from '@/app/components/common/CommonFooter'
import CommonHeader from '@/app/components/common/CommonHeader'
import WorkspaceList from '@/app/components/workspace/WorkspaceList'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function gateway() {
  const router = useRouter()
  
  return (
    <div className="flex flex-col p-4 ">
      <CommonHeader />
      <main className="flex-grow">
        <div className="flex flex-col items-center justify-center h-full p-4 bg-base-200 rounded-btn">
          
          <WorkspaceList/>
          {/* 워크스페이스 리스트 */}
          <button onClick={() => router.push(`/workspace/${1}`)} className="mt-4 btn btn-warning">bypass</button>
          
        </div>
      </main>
      <CommonFooter />
    </div>
  )
}

"use client"
import CommonFooter from '@/app/components/common/CommonFooter'
import CommonHeader from '@/app/components/common/CommonHeader'
import WorkspaceList from '@/app/components/workspace/WorkspaceList'

export default function Gateway() {
  return (
    <div className="flex flex-col p-4 bg-base-300 h-dvh">
      <CommonHeader />
      <main className="flex-grow p-4 bg-base-100 rounded-lg overflow-hidden">
        <div className="flex items-center justify-center h-full">
          <WorkspaceList/>
        </div>
      </main>
      <CommonFooter />
    </div>
  )
}

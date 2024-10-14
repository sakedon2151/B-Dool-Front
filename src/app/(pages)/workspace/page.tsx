"use client"
import CommonFooter from '@/app/components/common/CommonFooter'
import CommonHeader from '@/app/components/common/CommonHeader'
import WorkspaceList from '@/app/components/workspace/WorkspaceList'

export default function gateway() {
  return (
    <div className="flex flex-col p-4 h-dvh ">
      <CommonHeader />
      <main className="flex-grow">

        <div className="flex flex-col items-center justify-center h-full p-4 bg-base-200 rounded-lg">  
          <WorkspaceList/>
        </div>
      
      </main>
      <CommonFooter />
    </div>
  )
}

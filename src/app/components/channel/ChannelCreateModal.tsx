import React from 'react'

export default function ChannelCreateModal() {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4 text-center">새 채널 생성</h2>
      <form action="">
        <input
          type="text" 
          className="input input-bordered w-full mb-4" 
          placeholder="채널 이름"
          // value={}
          // onChange={(e) => setWorkspaceName(e.target.value)}
          required
        />
        <textarea
          className="textarea textarea-bordered resize-none w-full mb-4" 
          placeholder="채널 정보"
          maxLength={50}
          // value={}
          // onChange={(e) => setWorkspaceInfo(e.target.value)}
          required
        />

        <h3 className="divider font-bold text-lg opacity-75">채널 공개 여부</h3>
        <p className="font-thin text-sm text-center">*비공개 채널은 해당 채널의 참가자 초대로만 접속이 가능합니다.</p>
        <div className="form-control justify-center gap-4">
          <label className="label cursor-pointer p-0">
            <span className="label-text">공개</span>
            <input type="radio" name="radio-10" className="radio" defaultChecked />
          </label>
          <label className="label cursor-pointer p-0">
            <span className="label-text">비공개</span>
            <input type="radio" name="radio-10" className="radio" />
          </label>
        </div>
      </form>
    </div>
  )
}

'use client'
import ChannelCreateModal from "@/app/components/channel/ChannelCreateModal";
import SearchModal from "@/app/components/search/SearchModal";
import React from "react";

export default function Test() {
  
  const renderCard = (
    <div className="w-[640px] p-4 border rounded-lg bg-green-900">
      <h1 className="text-xl font-bold">안녕하세요!</h1>
      <p>이 페이지는 프로젝트 테스트 페이지입니다.</p>
      <p>데이터 접근없이 컴포넌트를 테스트 할 수 있습니다.</p>
    </div>
  )

  return (
    <>
      <div className="">
        <button className="btn" onClick={() => (document.getElementById('my_modal') as HTMLDialogElement).showModal()}>모달창 열기</button>
        {renderCard}
        {renderCard}
        {renderCard}
      </div>

      <dialog id="my_modal" className="modal modal-bottom md:modal-middle">
        <div className="modal-box p-4">
          
          <SearchModal/>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn">취소</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
    
  )
}

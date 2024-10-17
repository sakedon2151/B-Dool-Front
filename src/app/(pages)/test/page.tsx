import LoadingScreen from "@/app/components/common/LoadingScreen";
import React from "react";

export default function test() {
  
  const renderCard = (
    <div className="w-[640px] p-4 border rounded-lg bg-green-900">
      <h1 className="text-xl font-bold">안녕하세요!</h1>
      <p>이 페이지는 프로젝트 테스트 페이지입니다.</p>
      <p>데이터 접근없이 컴포넌트를 테스트 할 수 있습니다.</p>
    </div>
  )
  
  
  return (
    <div className="">
      <LoadingScreen/>

      {renderCard}
      {renderCard}
      {renderCard}
    </div>
  )
}

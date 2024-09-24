import { ChangeEvent, useRef, useState } from "react";

export default function AccountModal() {
  
  // 프롭스로 들어온 profileImgUrl 대입할것
  const [profileImage, setProfileImage] = useState<string>("https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp")
  
  const fileInput = useRef<HTMLInputElement>(null)
  
  const handleImgChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setProfileImage(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-row">

        <div className="avatar" onClick={() => {fileInput.current?.click()}}>
          <div className="w-24 rounded-btn">
            <img src={profileImage} alt="profile image"/>
          </div>
        </div>

        <input ref={fileInput} className="hidden" accept="image/png, image/jpg, image/jpeg" type="file" onChange={handleImgChange} />

        <div className="">
          <h2 className="font-bold text-2xl">NICKNAME</h2>
          <p>성명</p>
          <p>직책</p>
        </div>

      </div>

      <div className="">
        <p>이메일</p>
        <p>워크스페이스 참가일</p>
        <p>마지막 프로필 수정일</p>
      </div>
    </div>
  );
}

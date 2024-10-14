import { ProfileModel } from "@/app/models/profile.model";
import { useProfileStore } from "@/app/stores/profile.store";
import React, { useState } from "react";

interface UpdateProfileProps {
  onCancel: () => void;
}

export default function UpdateProfile({ onCancel }: UpdateProfileProps) {
  const currentProfile = useProfileStore(state => state.currentProfile);  // Zustand Store

  const [formData, setFormData] = useState<ProfileModel>();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault;
    await profileService.updateProfile(profileId, formData);
    onCancel()
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="nickname"
          // value={}
          placeholder="닉네임" 
          className="input w-full mb-4"
          // onChange={handleChange}
        />
        <input 
          type="text" 
          name="name"
          // value={}
          placeholder="실명" 
          className="input w-full mb-4" 
          // onChange={handleChange}
        />
        <input 
          type="email"
          name="email" 
          // value={}
          placeholder="이메일" 
          className="input w-full mb-4" 
          // onChange={handleChange}
        />
        <input
          type="text"
          name="position"
          // value={}
          placeholder="직책"
          className="input w-full mb-4"
          // onChange={handleChange}
        />

        <div className="flex justify-between">
          <button type="button" className="bg-base-300 btn rounded-btn w-[calc(50%-8px)] mr-2">취소하기</button>
          <button type="submit" className="bg-base-300 btn rounded-btn w-[calc(50%-8px)] ml-2">저장하기</button>
        </div>
      </form>
    </div>
  )
}

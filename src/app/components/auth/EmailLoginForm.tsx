import { BiMailSend } from "react-icons/bi";
import VerificationCodeForm from "./VerificationCodeForm";

export default function LoginForm() {
  return (
    <div className="bg-base-300 rounded-btn p-4 lg:w-[640px]">
      
      <h2 className="text-center text-lg font-bold">이메일로 시작하기</h2>
      <div className="divider mt-2"></div>
      <form className="text-center">
        <label className="input input-bordered flex items-center gap-2 mb-4">
          <BiMailSend className="w-6 h-6 opacity-70"/>
          <input type="email" className="" placeholder="이메일" />
        </label>

        <VerificationCodeForm/>

        <button className="btn" type="submit">로그인</button>
      </form>

    </div>
  );
}

import CommonHeader from "./components/common/CommonHeader";
import CommonFooter from "./components/common/CommonFooter";

export default function Home() {
  return (
    <div className="flex flex-col p-4 bg-base-300 h-dvh">
      <CommonHeader/>
      <main className="flex-grow p-4 bg-base-100 rounded-lg h-full">
        <div className="mt-32 text-center">
          <p className="">가볍게 시작하는 협업 메신저</p>
          <h2 className="mb-4 text-5xl font-bold">B-DOOL</h2>
          <button className="btn">시작하기</button>
        </div>
      </main> 
      <CommonFooter/>
    </div>
  );
}

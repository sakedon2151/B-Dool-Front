import CommonHeader from "./components/common/CommonHeader";
import CommonFooter from "./components/common/CommonFooter";

export default function Home() {
  return (
    <div className="p-4">
      <CommonHeader/>
      <main>
        <div className="p-4 bg-base-200 rounded-lg">
          <div className="hero min-h-screen"> 
            <div className="hero-content text-center">
              <div className="max-w-md">
                <h2 className="text-5xl font-bold">B-DOOL</h2>
                <p className="py-8">안녕</p>
                <button className="btn">이미지</button>
              </div>
            </div>            
          </div>
        </div>
      </main> 
      <CommonFooter/>
    </div>
  );
}

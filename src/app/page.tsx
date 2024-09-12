import WebHeader from "./components/index/WebHeader";
import WebFooter from "./components/index/WebFooter";

// index landing page
export default function Home() {
  return (
    <>
      <WebHeader />
      <main>
        <div className="card bg-base-200 rounded-2xl p-4 h-dvh">
          <h2>랜딩 페이지</h2>
        </div>
      </main>
      <WebFooter />
    </>
  );
}

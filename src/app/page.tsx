import WebHeader from "./components/index/WebHeader";
import WebFooter from "./components/index/WebFooter";

// index landing page
export default function Home() {
  return (
    <div className="p-4">
      <WebHeader />
      <main>
        <div className="bg-base-200 rounded-btn p-4">
          <h2>랜딩 페이지</h2>
        </div>
      </main>
      <WebFooter />
    </div>
  );
}

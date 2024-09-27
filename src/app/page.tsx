import WebHeader from "./components/common/WebHeader";
import WebFooter from "./components/common/WebFooter";
import { ThemeProvider } from "next-themes";

// index landing page
export default function Home() {
  return (
    <div className="p-4">
      <ThemeProvider attribute="data-theme" defaultTheme="nord" enableSystem={true}>
        <WebHeader />
      </ThemeProvider>
      <main>
        <div className="p-4 bg-base-200 rounded-btn">
          <h2>랜딩 페이지</h2>
        </div>
      </main>
      <WebFooter />
    </div>
  );
}

import CommonHeader from "./components/common/CommonHeader";
import CommonFooter from "./components/common/CommonFooter";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-4">
        <ThemeProvider attribute="data-theme" defaultTheme="nord" enableSystem={true}>
          <CommonHeader />
        </ThemeProvider>
        <main>
          <div className="p-4 bg-base-200 rounded-btn">
            <h2>랜딩 페이지</h2>
          </div>
        </main>
        <CommonFooter />
      </div>
      
      <ReactQueryDevtools/>
    </QueryClientProvider>
  );
}

"use client";
import { useRouter } from "next/navigation";
import ThemeSwitcher from "./ThemeSwitcher";

export default function WebHeader() {
  const router = useRouter();

  return (
    <header className="mb-4 bg-base-200 rounded-btn">
      <div className="navbar">
        <div className="navbar-start">
          <a className="text-lg btn btn-ghost" href="/">
            B-DOOL
          </a>
        </div>
        <div className="navbar-end">
          <button
            onClick={() => router.push("/auth")}
            className="text-sm btn btn-ghost"
          >
            시작하기
          </button>

          <ThemeSwitcher/>
        </div>
      </div>
    </header>
  );
}

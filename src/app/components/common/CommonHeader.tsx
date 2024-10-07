"use client";
import { usePathname, useRouter } from "next/navigation";
import ThemeSwitcher from "./ThemeSwitcher";

interface CommonHeaderProps {
  showAuthButton?: boolean
}

export default function CommonHeader({ showAuthButton }: CommonHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const authButton = showAuthButton ?? (!pathname.startsWith('/auth') && !pathname.startsWith('/workspace'));

  return (
    <header className="mb-4 bg-base-200 rounded-lg">
      <div className="navbar">
        <div className="navbar-start">
          <a className="text-lg btn btn-ghost" href="/">
            B-DOOL
          </a>
        </div>

        <div className="navbar-end">
          {authButton && 
            <button
              className="text-sm btn btn-ghost"
              onClick={() => router.push("/auth")}
            >
              시작하기
            </button>
          }
          <ThemeSwitcher/>
        </div>
      </div>
    </header>
  );
}

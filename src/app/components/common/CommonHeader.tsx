"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDove } from "@fortawesome/free-solid-svg-icons";
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
    <header className="navbar mb-4 bg-base-100 rounded-lg">
      <div className="navbar-start">
        <a className="text-lg btn btn-ghost" href="/">
          <FontAwesomeIcon icon={faDove} className="opacity-75 w-4 h-4"/>
          B-DOOL
        </a>
      </div>

      <div className="navbar-end">
        <button className="btn" onClick={() => router.push("/test")}>
          테스트
        </button>
        {authButton && (
          <button className="btn" onClick={() => router.push("/auth")}>
            시작하기
          </button>
        )}
        <ThemeSwitcher />
      </div>
    </header>
  );
}

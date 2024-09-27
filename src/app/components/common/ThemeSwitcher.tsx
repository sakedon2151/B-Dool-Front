import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
      className="w-full max-w-xs select select-bordered"
    >
      <option value="nord">Nord</option>
      <option value="dim">Dim</option>
      {/* 다른 daisyUI 테마 옵션들을 여기에 추가할 수 있습니다 */}
    </select>
  );
}

import { FaGithub } from "react-icons/fa";

export default function WebFooter() {
  return (
    <footer className="p-4 mt-4 footer bg-base-200 rounded-btn">
      <nav className="flex items-center justify-between w-full">
        <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
        <a><FaGithub className="w-6 h-6"/></a>
      </nav>
    </footer>
  );
}

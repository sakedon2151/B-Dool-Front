import { FaGithub } from "react-icons/fa";

export default function WebFooter() {
  return (
    <footer className="footer bg-base-200 rounded-btn mt-4 p-4">
      <nav className="flex justify-between items-center w-full">
        <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
        <a><FaGithub className="w-6 h-6"/></a>
      </nav>
    </footer>
  );
}

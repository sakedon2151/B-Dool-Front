"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons"

export default function CommonFooter({}) {
  return (
    <footer className="p-2 mt-4 footer bg-base-100 rounded-lg">
      <nav className="flex items-center justify-between w-full">
        <p className="ml-4 text-md font-bold opacity-75">Copyright © {new Date().getFullYear()} - All right reserved</p>
        <button className="btn">
          <FontAwesomeIcon icon={faGithub} className="opacity-75 w-4 h-4"/>
        </button>
      </nav>
    </footer>
  );
}

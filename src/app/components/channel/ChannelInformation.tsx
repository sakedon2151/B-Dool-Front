import { HiHashtag } from "react-icons/hi2";
import { IoSearch } from "react-icons/io5";
import { HiOutlineVideoCamera } from "react-icons/hi";

// workspace page component

export default function ChannelInformation() {
  return (
    <div className="navbar">
      <div className="navbar-start flex gap-4">
        <div className="avatar">
          <div className="w-12 rounded-full">
            <img src="https://mir-s3-cdn-cf.behance.net/project_modules/fs/eed560189998237.65b50b647abf4.png" />
          </div>
        </div>

        <div className="flex items-center">
          <HiHashtag className="w-5 h-5"/>
          <p>Channel 1</p>
        </div>
      </div>

      <nav className="navbar-end">
          <div className="tooltip tooltip-bottom" data-tip="영상 통화">
            <button className="btn btn-ghost btn-circle">
              <HiOutlineVideoCamera className="w-5 h-5"/>
            </button>
          </div>

          <div className="tooltip tooltip-bottom" data-tip="검색">
            <button className="btn btn-ghost btn-circle">
              <IoSearch className="w-5 h-5"/>
            </button>
          </div>
        </nav>
    </div>
  );
}

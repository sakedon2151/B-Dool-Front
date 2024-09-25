import { HiHashtag } from "react-icons/hi2";
import { LuCalendarCheck2 } from "react-icons/lu";
import { IoSearch } from "react-icons/io5";
import { HiOutlineVideoCamera, HiOutlineBell } from "react-icons/hi";

export default function WorkspaceHeader() {
  return (
    <div className="navbar">
      <div className="navbar-start flex gap-2 ml-14 lg:m-0">
        <div className="avatar">
          <div className="w-12 rounded-btn">
            <img src="https://mir-s3-cdn-cf.behance.net/project_modules/fs/eed560189998237.65b50b647abf4.png" />
          </div>
        </div>
        <div className="flex flex-col">
          <h2 className="font-bold">WORKSPACE NAME</h2>
          <div className="flex items-center">
            <HiHashtag className="w-4 h-4"/>
            <p>Channel 1</p>
          </div>
        </div>
      </div>
      
      <div className="navbar-end mr-14 lg:m-0">
        <div className="tooltip tooltip-bottom" data-tip="일정">
          <button className="btn btn-ghost btn-circle">
            <LuCalendarCheck2 className="w-5 h-5"/>
          </button>
        </div>
        
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

        <div className="dropdown dropdown-end tooltip tooltip-bottom" data-tip="알림">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <div className="indicator">
              <HiOutlineBell className="w-5 h-5"/>
              <span className="badge badge-xs badge-primary indicator-item z-0"></span>
            </div>
          </div>

          <div tabIndex={0} className="dropdown-content bg-base-100 rounded-box z-[20] w-52 p-2 shadow">
            알림 리스트 컴포넌트
          </div>
        </div>
      </div>
    </div>
  );
}

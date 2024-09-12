import { IoSearch } from "react-icons/io5";
import { HiOutlineBell } from "react-icons/hi";

// workspace page component
export default function WorkspaceHeader() {
  return (
    <div className="">
      <div className="navbar">
        
        <div className="navbar-start">
          <a className="btn btn-ghost text-xl">WORKSPACE NAME</a>
        </div>
        
        <div className="navbar-end">
          <div className="tooltip tooltip-bottom" data-tip="검색">
            <button className="btn btn-ghost btn-circle">
              <IoSearch className="w-5 h-5"/>
            </button>
          </div>
          
          <div className="tooltip tooltip-bottom" data-tip="알림">
            <button className="btn btn-ghost btn-circle">
              <div className="indicator">
                <HiOutlineBell className="w-5 h-5"/>
                <span className="badge badge-xs badge-primary indicator-item"></span>
              </div>
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}

// workspace page component
export default function ChannelParticipantList() {
  return (
    <div className="">
      <ul className="menu">
        <li className="menu-title">온라인 - 6</li>

        {/* map loop */}
        <li>
          <a>
            <div className="avatar online placeholder">
              <div className="bg-neutral text-neutral-content w-8 rounded-full">
                <span className="text-xs">U</span>
              </div>
            </div>
            <p>username</p>
          </a>
        </li>
        <li>
          <a>
            <div className="avatar online placeholder">
              <div className="bg-neutral text-neutral-content w-8 rounded-full">
                <span className="text-xs">U</span>
              </div>
            </div>
            <p>username</p>
          </a>
        </li>
        <li>
          <a>
            <div className="avatar online placeholder">
              <div className="bg-neutral text-neutral-content w-8 rounded-full">
                <span className="text-xs">U</span>
              </div>
            </div>
            <p>username</p>
          </a>
        </li>
        <li>
          <a>
            <div className="avatar online placeholder">
              <div className="bg-neutral text-neutral-content w-8 rounded-full">
                <span className="text-xs">U</span>
              </div>
            </div>
            <p>username</p>
          </a>
        </li>
        <li>
          <a>
            <div className="avatar online placeholder">
              <div className="bg-neutral text-neutral-content w-8 rounded-full">
                <span className="text-xs">U</span>
              </div>
            </div>
            <p>username</p>
          </a>
        </li>
        <li>
          <a>
            <div className="avatar online placeholder">
              <div className="bg-neutral text-neutral-content w-8 rounded-full">
                <span className="text-xs">U</span>
              </div>
            </div>
            <p>username</p>
          </a>
        </li>
      </ul>

      {/* <div className="divider"></div> */}

      <ul className="menu">
        <li className="menu-title">오프라인 - 1</li>

        {/* map loop */}
        <li>
          <a>
            <div className="avatar offline placeholder">
              <div className="bg-neutral text-neutral-content w-8 rounded-full">
                <span className="text-xs">U</span>
              </div>
            </div>
            <p>username</p>
          </a>
        </li>
      </ul>
    </div>
  );
}

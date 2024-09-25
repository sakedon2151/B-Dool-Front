export default function WorkspaceListNav() {
  return (
    <div className="shadow-inner h-full">
      <ul className="menu p-1">
        
        {/* response list loop */}
        <li className="m-1">
          <a className="block aspect-square w-12 p-0 overflow-hidden rounded-btn transition-all hover:rounded-3xl">
            <img className="w-full h-full object-cover" src="https://mir-s3-cdn-cf.behance.net/project_modules/fs/eed560189998237.65b50b647abf4.png" alt="workspace_thumbnail_img"/>
          </a>
        </li>

      </ul>
    </div>
  )
}

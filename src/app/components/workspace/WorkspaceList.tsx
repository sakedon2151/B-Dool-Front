export default function WorkspaceList() {
  return (
    <div className="h-full shadow-inner">
      <ul className="p-1 menu">
        
        {/* response list loop */}
        <li className="m-1">
          <a className="block w-12 p-0 overflow-hidden transition-all aspect-square rounded-btn hover:rounded-3xl">
            <img className="object-cover w-full h-full" src="https://mir-s3-cdn-cf.behance.net/project_modules/fs/eed560189998237.65b50b647abf4.png" alt="workspace_thumbnail_img"/>
          </a>
        </li>

      </ul>
    </div>
  )
}

import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ErrorScreen() {
  return (
    <div className="fixed z-50 backdrop-blur-md">
      <div className="flex flex-col items-center justify-center w-screen h-screen gap-4">
        <FontAwesomeIcon icon={faCircleExclamation} className="bdool-lg-icon"/>

        <p className="text-lg font-bold">에러가 발생했습니다.</p>
      </div>
    </div>
  );
}

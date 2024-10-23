import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FallbackProps } from "react-error-boundary";

export default function ErrorScreen({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="fixed z-50 backdrop-blur-md">
      <div className="flex flex-col items-center justify-center w-screen h-screen gap-4">
        <FontAwesomeIcon icon={faCircleExclamation} className="w-6 h-6 opacity-75"/>
        <p className="font-bold text-lg opacity-75">오류가 발생했습니다.</p>
        <p>{error.message}</p>
        <button className="btn" onClick={resetErrorBoundary}>다시 시도</button>
      </div>
    </div>
  );
}

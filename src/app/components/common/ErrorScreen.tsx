export default function ErrorScreen() {
  return (
    <div className="fixed z-50 backdrop-blur-md">
      <div className="flex flex-col items-center justify-center w-screen h-screen gap-4">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="text-lg font-bold">에러가 발생했습니다.</p>
      </div>
    </div>
  );
}

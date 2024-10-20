export default function LoadingScreen() {
  return (
    <div className="absolute z-50 backdrop-blur-md">
      <div className="flex flex-col items-center justify-center w-screen h-screen gap-4">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="text-lg font-bold">잠시만 기다려주세요.</p>
      </div>
    </div>
  )
}

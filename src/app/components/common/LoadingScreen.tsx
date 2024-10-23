export default function LoadingScreen() {
  return (
    <div className="absolute z-50 backdrop-blur-md">
      <div className="flex flex-col items-center justify-center w-screen h-screen gap-4">
        <span className="loading loading-spinner loading-lg opacity-75"></span>
        <p className="font-bold text-lg opacity-75">잠시만 기다려주세요.</p>
      </div>
    </div>
  )
}

export default function ProgressBar({ progress }) {
  return (
    <div className="w-full h-1 bg-gray-700">
      <div
        className="progress-bar"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
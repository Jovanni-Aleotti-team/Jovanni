export default function ProgressBar({ progress }) {
    return (
      <div className="w-full bg-gray-800 h-1 mx-auto">
        <div 
          className="progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>
    )
  }
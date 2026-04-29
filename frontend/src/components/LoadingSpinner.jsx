import { ClipLoader } from 'react-spinners'

function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <ClipLoader color="#c96d22" size={44} />
      <p className="text-warm-400 text-sm">{message}</p>
    </div>
  )
}

export default LoadingSpinner
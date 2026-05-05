function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <span className="text-5xl">⚠️</span>
      <h3 className="text-lg font-semibold text-red-600 m-0">May Error na Nangyari</h3>
      <p className="text-warm-400 text-sm max-w-xs m-0">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary mt-2">
          Try Again
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
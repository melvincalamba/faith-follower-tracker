function EmptyState({ icon = '🙏', title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <span className="text-5xl">{icon}</span>
      <h3 className="text-lg font-semibold text-warm-800 m-0">{title}</h3>
      <p className="text-warm-400 text-sm max-w-xs m-0">{message}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

export default EmptyState
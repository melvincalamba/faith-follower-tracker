function ConfirmModal({ isOpen, title, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      onClick={onCancel}
    >
      {/* Modal Card — i-stop ang click propagation para hindi maisara kapag na-click ang card */}
      <div
        className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mx-auto mb-4">
          <span className="text-3xl">🗑️</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-warm-900 text-center mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-warm-500 text-sm text-center mb-6">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn-danger flex-1"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
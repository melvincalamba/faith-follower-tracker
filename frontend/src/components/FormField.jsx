function FormField({ label, error, required, children, hint }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="label-text">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {hint && <span className="text-xs text-warm-400 -mt-1">{hint}</span>}
      {children}
      {error && (
        <span className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
          ⚠️ {error}
        </span>
      )}
    </div>
  )
}

import PropTypes from 'prop-types'

FormField.propTypes = {
  label:    PropTypes.string.isRequired,
  error:    PropTypes.string,
  required: PropTypes.bool,
  hint:     PropTypes.string,
  children: PropTypes.node.isRequired,
}

export default FormField
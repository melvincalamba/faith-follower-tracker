const config = {
  'Pre-FIC':     { bg: 'bg-orange-100',  text: 'text-orange-700',  dot: 'bg-orange-400'  },
  'FIC1':        { bg: 'bg-blue-100',    text: 'text-blue-700',    dot: 'bg-blue-400'    },
  'FIC2':        { bg: 'bg-purple-100',  text: 'text-purple-700',  dot: 'bg-purple-400'  },
  'Pre-CellDev': { bg: 'bg-teal-100',    text: 'text-teal-700',    dot: 'bg-teal-400'    },
  'CellDev':     { bg: 'bg-green-100',   text: 'text-green-700',   dot: 'bg-green-500'   },
}

function ProgressBadge({ progress }) {
  const c = config[progress] || { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' }
  return (
    <span className={`badge ${c.bg} ${c.text} gap-1.5`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} inline-block`} />
      {progress}
    </span>
  )
}

import PropTypes from 'prop-types'

ProgressBadge.propTypes = {
  progress: PropTypes.string.isRequired,
}

export default ProgressBadge
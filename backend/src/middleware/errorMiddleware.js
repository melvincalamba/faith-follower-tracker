// ─── 404 Handler ─────────────────────────────────────────
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`)
  res.status(404)
  next(error)
}

// ─── Global Error Handler ────────────────────────────────
const errorHandler = (err, req, res, next) => {
  // Kung 200 pa rin ang status, ibig sabihin walang specific status na na-set
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode

  console.error(`❌ [${statusCode}] ${err.message}`)

  res.status(statusCode).json({
    error:   err.message || 'Internal Server Error',
    // Stack trace — development only, hindi sa production
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

module.exports = { notFound, errorHandler }
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="min-h-screen bg-warm-50 flex flex-col items-center
                    justify-center gap-4 text-center px-4">
      <span className="text-7xl">🙏</span>
      <h1 className="text-8xl font-bold text-warm-200 m-0">404</h1>
      <h2 className="text-2xl font-bold text-warm-800 -mt-4">Page Not Found</h2>
      <p className="text-warm-400 max-w-sm text-sm">
        Mukhang naliligaw ka. Wala ang page na hinahanap mo.
      </p>
      <Link to="/" className="btn-primary no-underline mt-2">
        Bumalik sa Dashboard
      </Link>
    </div>
  )
}

export default NotFound
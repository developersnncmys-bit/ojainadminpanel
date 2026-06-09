import { Link } from 'react-router-dom'
import { Leaf } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Leaf className="h-12 w-12 text-brand-500" />
      <h1 className="mt-4 text-4xl font-extrabold text-slate-800">404</h1>
      <p className="mt-1 text-slate-500">This page doesn't exist.</p>
      <Link to="/" className="btn-primary mt-6">Back to Dashboard</Link>
    </div>
  )
}

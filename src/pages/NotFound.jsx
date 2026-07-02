import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { Button } from '../components/ui'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <span className="mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-brand-50 text-brand-500">
        <Compass size={30} strokeWidth={1.8} />
      </span>
      <p className="font-display mb-1 text-5xl font-bold text-neutral-200">404</p>
      <h1 className="font-display mb-2 text-xl font-bold text-neutral-900">This page wandered off</h1>
      <p className="mb-6 max-w-sm text-sm leading-relaxed text-neutral-500">
        The link may be old, or the skill may have been unpublished. The marketplace is a good place to get your bearings.
      </p>
      <div className="flex gap-2.5">
        <Link to="/app"><Button variant="outline">Go home</Button></Link>
        <Link to="/app/marketplace"><Button>Browse skills</Button></Link>
      </div>
    </div>
  )
}

import { CameraIcon } from '@heroicons/react/24/outline'
import { Card } from '@/components/ui'

export function ProgressPhotosSection() {
  return (
    <Card className="text-center py-10 rounded-2xl bg-slate-50/80">
      <CameraIcon className="h-8 w-8 text-slate-300 mx-auto mb-2" />
      <p className="text-sm font-medium text-slate-500">No progress photos yet</p>
      <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
        Capture optional photo memories on vacation days — full photo logging is coming soon.
      </p>
    </Card>
  )
}

import { ScaleIcon } from '@heroicons/react/24/outline'
import { Card } from '@/components/ui'

export function MeasurementsSection() {
  return (
    <Card className="text-center py-10 rounded-2xl bg-slate-50/80">
      <ScaleIcon className="h-8 w-8 text-slate-300 mx-auto mb-2" />
      <p className="text-sm font-medium text-slate-500">Measurements coming soon</p>
      <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
        Track waist, hips, and more when you&apos;re ready.
      </p>
    </Card>
  )
}

import { useMemo } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts'
import { useWeightStore } from '@/modules/weight'
import { Card } from '@/components/ui'

function formatAxisDate(dateKey: string): string {
  const [, month, day] = dateKey.split('-')
  return `${Number(month)}/${Number(day)}`
}

export function WeightChart() {
  const entries = useWeightStore((s) => s.entries)
  const points = useMemo(() => useWeightStore.getState().getChartPoints(), [entries])
  const progress = useMemo(() => useWeightStore.getState().getProgress(), [entries])

  if (points.length < 2) {
    return (
      <Card className="text-center py-12">
        <p className="text-sm text-slate-500">
          {points.length === 0
            ? 'Your weight graph will appear after you log entries.'
            : 'Log one more weigh-in to see your trend line.'}
        </p>
      </Card>
    )
  }

  const goalWeight = progress.goalWeight

  return (
    <Card padding="md" className="overflow-hidden">
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={points} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatAxisDate}
            tick={{ fill: '#94A3B8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={['dataMin - 2', 'dataMax + 2']}
            tick={{ fill: '#94A3B8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 24px rgba(15,23,42,0.08)',
              fontSize: 13,
            }}
            formatter={(value: number) => [`${value} lb`, 'Weight']}
            labelFormatter={(label) => label}
          />
          {goalWeight != null && (
            <ReferenceLine
              y={goalWeight}
              stroke="#60A5FA"
              strokeDasharray="4 4"
              strokeWidth={1}
            />
          )}
          <Area
            type="monotone"
            dataKey="weight"
            stroke="#2563EB"
            strokeWidth={2.5}
            fill="url(#weightGradient)"
            dot={{ r: 3, fill: '#2563EB', strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#2563EB' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}

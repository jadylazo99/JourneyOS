import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePetsStore } from '@/modules/pets'
import { useProfileStore } from '@/modules/profile'
import { PetTaskCard } from './PetTaskCard'
import { PetTaskActionSheet } from './PetTaskActionSheet'
import { VacationPetPrompt } from './VacationPetPrompt'
import type { PetTask, PetTaskStatus } from '@/modules/pets'
import type { DayModeId } from '@/modules/daily/types'

interface PetsTodayPanelProps {
  dayMode: DayModeId
}

export function PetsTodayPanel({ dayMode }: PetsTodayPanelProps) {
  const pets = useProfileStore((s) => s.profile.pets)
  const ensureTodayTasks = usePetsStore((s) => s.ensureTodayTasks)
  const getTodayTasks = usePetsStore((s) => s.getTodayTasks)
  const vacationState = usePetsStore((s) => s.getVacationState())
  const setPetTraveling = usePetsStore((s) => s.setPetTraveling)
  const updateTaskStatus = usePetsStore((s) => s.updateTaskStatus)

  const [activeTask, setActiveTask] = useState<PetTask | null>(null)

  useEffect(() => {
    ensureTodayTasks(dayMode)
  }, [dayMode, ensureTodayTasks])

  const tasks = getTodayTasks()
  const petNames = pets.filter((p) => p.name).map((p) => p.name)
  const pendingCount = tasks.filter((t) => t.status === 'pending').length
  const isVacation = dayMode === 'vacation'
  const needsTravelPrompt =
    isVacation && vacationState?.travelingWithUser === null

  if (needsTravelPrompt) {
    return (
      <VacationPetPrompt
        petNames={petNames}
        onTraveling={() => setPetTraveling(true)}
        onNotTraveling={() => setPetTraveling(false)}
      />
    )
  }

  if (tasks.length === 0) return null

  const isHandoff = isVacation && vacationState?.travelingWithUser === false

  return (
    <>
      <div
        className="rounded-2xl border border-white/15 p-4 space-y-3"
        style={{ background: 'rgba(255, 255, 255, 0.05)' }}
      >
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent/80">
            {isHandoff ? 'Pet care handoff' : 'Pet care'}
          </p>
          <Link
            to="/pets"
            className="text-[11px] font-medium text-white/45 hover:text-white/70 transition-colors"
          >
            Open →
          </Link>
        </div>

        {isHandoff && (
          <p className="text-sm text-white/55 leading-relaxed">
            {petNames.join(' & ')} is staying home. Complete the handoff checklist.
          </p>
        )}

        {pendingCount === 0 && tasks.length > 0 ? (
          <p className="text-sm text-white/60">All pet tasks handled for today.</p>
        ) : (
          <div className="space-y-2">
            {tasks.slice(0, 4).map((task) => (
              <PetTaskCard
                key={task.id}
                task={task}
                compact
                onAction={() => setActiveTask(task)}
              />
            ))}
            {tasks.length > 4 && (
              <p className="text-xs text-white/35 text-center pt-1">
                +{tasks.length - 4} more on Pets page
              </p>
            )}
          </div>
        )}
      </div>

      <PetTaskActionSheet
        open={activeTask != null}
        onClose={() => setActiveTask(null)}
        taskLabel={activeTask?.label}
        onSelect={(status: PetTaskStatus) => {
          if (activeTask) updateTaskStatus(activeTask.id, status)
        }}
      />
    </>
  )
}

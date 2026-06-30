import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePetsStore } from '@/modules/pets'
import { useProfileStore } from '@/modules/profile'
import { useDailyStore } from '@/modules/daily'
import {
  PetCard,
  PetTaskCard,
  PetTaskActionSheet,
  PetProfileDetail,
  PetNotesSection,
  PetRemindersSection,
  PetHistorySection,
} from '@/components/pets'
import type { PetTask, PetTaskStatus } from '@/modules/pets'

export function PetsPage() {
  const hydratePets = usePetsStore((s) => s.hydrate)
  const hydrateProfile = useProfileStore((s) => s.hydrate)
  const petsHydrated = usePetsStore((s) => s.hydrated)
  const profileHydrated = useProfileStore((s) => s.hydrated)
  const isModuleEnabled = useProfileStore((s) => s.isModuleEnabled)
  const pets = useProfileStore((s) => s.profile.pets)
  const todayRecord = useDailyStore((s) => s.todayRecord)

  const ensureTodayTasks = usePetsStore((s) => s.ensureTodayTasks)
  const getTodayTasks = usePetsStore((s) => s.getTodayTasks)
  const updateTaskStatus = usePetsStore((s) => s.updateTaskStatus)
  const addNote = usePetsStore((s) => s.addNote)
  const getProgressStats = usePetsStore((s) => s.getProgressStats)
  const getNotesForPet = usePetsStore((s) => s.getNotesForPet)
  const getTaskHistory = usePetsStore((s) => s.getTaskHistory)

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeTask, setActiveTask] = useState<PetTask | null>(null)
  const [tab, setTab] = useState<'care' | 'profile' | 'notes' | 'reminders' | 'history'>('care')

  useEffect(() => {
    hydratePets()
    hydrateProfile()
  }, [hydratePets, hydrateProfile])

  const dayMode = todayRecord?.dayMode.mode ?? 'normal'

  useEffect(() => {
    if (petsHydrated) ensureTodayTasks(dayMode)
  }, [petsHydrated, dayMode, ensureTodayTasks])

  useEffect(() => {
    const named = pets.filter((p) => p.name)
    if (named.length > 0 && !selectedId) {
      setSelectedId(named[0].id)
    }
  }, [pets, selectedId])

  if (!petsHydrated || !profileHydrated) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-blue animate-spin" />
      </div>
    )
  }

  if (!isModuleEnabled('pets')) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-blue p-8 text-white text-center shadow-card-lg">
          <p className="text-lg font-semibold">Pets module is off</p>
          <p className="text-sm text-white/60 mt-2">
            Enable Pets in Profile to manage your companions.
          </p>
          <Link to="/profile" className="inline-block mt-4 text-sm font-semibold text-accent">
            Go to Profile →
          </Link>
        </div>
      </div>
    )
  }

  const namedPets = pets.filter((p) => p.name)
  const selectedPet = namedPets.find((p) => p.id === selectedId) ?? namedPets[0]
  const todayTasks = getTodayTasks().filter(
    (t) => !selectedPet || t.petId === selectedPet.id,
  )
  const stats = getProgressStats(selectedPet?.id)
  const notes = selectedPet ? getNotesForPet(selectedPet.id) : []
  const history = getTaskHistory(selectedPet?.id)

  const tabs = [
    { id: 'care' as const, label: 'Daily care' },
    { id: 'profile' as const, label: 'Profile' },
    { id: 'notes' as const, label: 'Notes' },
    { id: 'reminders' as const, label: 'Reminders' },
    { id: 'history' as const, label: 'History' },
  ]

  return (
    <div className="min-h-[80vh] -mx-5 -mt-6 md:-mx-8 md:-mt-10">
      <div
        className="px-5 pt-8 pb-32 md:px-8 md:pt-12"
        style={{
          background: 'linear-gradient(165deg, #0F172A 0%, #1e3a8a 55%, #0F172A 100%)',
          minHeight: '100%',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto space-y-6"
        >
          <div>
            <Link
              to="/resources"
              className="text-xs text-white/40 hover:text-white/60 transition-colors"
            >
              ← Resources
            </Link>
            <h1 className="text-2xl font-semibold text-white mt-3 flex items-center gap-2">
              Pets
              <span className="text-lg opacity-40">🐾</span>
            </h1>
            <p className="text-sm text-white/45 mt-1">
              Daily care, reminders, and progress for your companions
            </p>
          </div>

          {namedPets.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
              <p className="text-white/70">No pets yet</p>
              <p className="text-sm text-white/40 mt-2">
                Add a pet in Profile to get started.
              </p>
              <Link
                to="/profile"
                className="inline-block mt-4 text-sm font-semibold text-accent"
              >
                Add a pet →
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {namedPets.map((pet) => (
                  <PetCard
                    key={pet.id}
                    pet={pet}
                    stats={getProgressStats(pet.id)}
                    selected={pet.id === selectedPet?.id}
                    onClick={() => setSelectedId(pet.id)}
                  />
                ))}
              </div>

              {selectedPet && (
                <>
                  <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
                    {tabs.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTab(t.id)}
                        className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                          tab === t.id
                            ? 'bg-white/15 text-white'
                            : 'text-white/40 hover:text-white/60'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {tab === 'care' && (
                      <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                          Today's checklist
                        </p>
                        {todayTasks.length === 0 ? (
                          <p className="text-sm text-white/40 text-center py-8">
                            No tasks for today yet.
                          </p>
                        ) : (
                          todayTasks.map((task) => (
                            <PetTaskCard
                              key={task.id}
                              task={task}
                              onAction={() => setActiveTask(task)}
                            />
                          ))
                        )}
                      </div>
                    )}

                    {tab === 'profile' && (
                      <PetProfileDetail pet={selectedPet} stats={stats} />
                    )}

                    {tab === 'notes' && (
                      <PetNotesSection
                        notes={notes}
                        onAdd={(text) => addNote(selectedPet.id, selectedPet.name, text)}
                      />
                    )}

                    {tab === 'reminders' && (
                      <PetRemindersSection pet={selectedPet} />
                    )}

                    {tab === 'history' && (
                      <PetHistorySection history={history} />
                    )}
                  </motion.div>
                </>
              )}
            </>
          )}
        </motion.div>
      </div>

      <PetTaskActionSheet
        open={activeTask != null}
        onClose={() => setActiveTask(null)}
        taskLabel={activeTask?.label}
        onSelect={(status: PetTaskStatus) => {
          if (activeTask) updateTaskStatus(activeTask.id, status)
        }}
      />
    </div>
  )
}

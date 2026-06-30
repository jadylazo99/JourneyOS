import { useDailyStore } from '@/modules/daily/store'

/** Mark today's guided workout task complete after a fitness session. */
export function completeGuidedWorkoutTask(): void {
  const store = useDailyStore.getState()
  const task = store.getGuidedTasks().find(
    (t) => t.type === 'workout' && (t.status === 'pending' || t.status === 'rescheduled'),
  )
  if (task) {
    store.setGuidedTaskStatus(task.id, 'completed')
  }
}

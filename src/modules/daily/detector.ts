export function getCoachMessage(consistencyScore: number): string {
  if (consistencyScore >= 50) return "You've been consistent lately. That matters."
  if (consistencyScore >= 20) return 'Small steps still count.'
  return "Showing up is the win. You're here."
}

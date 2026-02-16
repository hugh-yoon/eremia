import { CHAPTER_COUNTS } from './data'

export const todayStr = () => new Date().toISOString().split('T')[0]

export const calcCPD = (total, days) =>
  !days || days <= 0 || total === 0 ? 1 : Math.max(1, Math.ceil(total / days))

export const buildChapters = (books) => {
  const chapters = []
  books.forEach(book => {
    for (let c = 1; c <= (CHAPTER_COUNTS[book] || 1); c++)
      chapters.push({ book, chapter: c, key: `${book}-${c}` })
  })
  return chapters
}

export const getStreak = (dates = []) => {
  const sorted = [...new Set(dates)].sort().reverse()
  let streak = 0
  const today = new Date(todayStr())
  for (let i = 0; i < sorted.length; i++) {
    const exp = new Date(today)
    exp.setDate(today.getDate() - i)
    if (new Date(sorted[i]).toDateString() === exp.toDateString()) streak++
    else break
  }
  return streak
}

export const getPlanStats = (plan) => {
  const total = plan.chapters.length
  const done = Object.keys(plan.completed || {}).length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  const remaining = total - done
  return {
    total,
    done,
    pct,
    remaining,
    streak: getStreak(plan.completedDates),
    daysLeft: Math.ceil(remaining / plan.chaptersPerDay),
  }
}

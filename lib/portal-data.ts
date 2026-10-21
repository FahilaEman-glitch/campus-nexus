export const MIN_ATTENDANCE = 75

export type SessionStatus = 'present' | 'late' | 'absent'

export type Session = {
  date: string
  topic: string
  status: SessionStatus
}

export type Course = {
  code: string
  name: string
  professor: string
  schedule: string
  room: string
  attended: number
  total: number
  sessions: Session[]
}

export const courses: Course[] = [
  {
    code: 'CS 341',
    name: 'Distributed Systems',
    professor: 'Dr. Elena Marsh',
    schedule: 'Mon · Wed · Fri, 10:30 AM',
    room: 'Hall B, Room 204',
    attended: 22,
    total: 23,
    sessions: [
      { date: 'Oct 21', topic: 'Raft leader election', status: 'present' },
      { date: 'Oct 19', topic: 'Consensus & Paxos', status: 'present' },
      { date: 'Oct 16', topic: 'Vector clocks', status: 'late' },
      { date: 'Oct 14', topic: 'Replication strategies', status: 'present' },
      { date: 'Oct 12', topic: 'CAP theorem', status: 'absent' },
      { date: 'Oct 09', topic: 'Failure detectors', status: 'present' },
    ],
  },
  {
    code: 'CS 320',
    name: 'Machine Learning',
    professor: 'Prof. Daniel Okafor',
    schedule: 'Tue · Thu, 1:00 PM',
    room: 'Science Block, Lab 3',
    attended: 19,
    total: 21,
    sessions: [
      { date: 'Oct 20', topic: 'Backpropagation', status: 'present' },
      { date: 'Oct 15', topic: 'Gradient descent variants', status: 'present' },
      { date: 'Oct 13', topic: 'Regularization', status: 'absent' },
      { date: 'Oct 08', topic: 'Logistic regression', status: 'present' },
      { date: 'Oct 06', topic: 'Bias-variance tradeoff', status: 'late' },
      { date: 'Oct 01', topic: 'Linear models', status: 'present' },
    ],
  },
  {
    code: 'MA 260',
    name: 'Linear Algebra',
    professor: 'Dr. Priya Raman',
    schedule: 'Mon · Wed, 2:30 PM',
    room: 'Math Tower, Room 112',
    attended: 17,
    total: 20,
    sessions: [
      { date: 'Oct 21', topic: 'Eigenvalues & eigenvectors', status: 'present' },
      { date: 'Oct 19', topic: 'Determinants', status: 'absent' },
      { date: 'Oct 14', topic: 'Change of basis', status: 'present' },
      { date: 'Oct 12', topic: 'Linear transformations', status: 'present' },
      { date: 'Oct 07', topic: 'Vector spaces', status: 'absent' },
      { date: 'Oct 05', topic: 'Matrix inverses', status: 'present' },
    ],
  },
  {
    code: 'HU 210',
    name: 'Ethics in Technology',
    professor: 'Prof. Marcus Lee',
    schedule: 'Thu, 4:00 PM',
    room: 'Humanities, Room 08',
    attended: 11,
    total: 15,
    sessions: [
      { date: 'Oct 15', topic: 'Algorithmic bias', status: 'absent' },
      { date: 'Oct 08', topic: 'Privacy & surveillance', status: 'present' },
      { date: 'Oct 01', topic: 'AI accountability', status: 'absent' },
      { date: 'Sep 24', topic: 'Utilitarian frameworks', status: 'present' },
      { date: 'Sep 17', topic: 'Data ownership', status: 'late' },
      { date: 'Sep 10', topic: 'Intro to tech ethics', status: 'present' },
    ],
  },
]

export const totalAttended = courses.reduce((sum, c) => sum + c.attended, 0)
export const totalClasses = courses.reduce((sum, c) => sum + c.total, 0)
export const overallAttendance = Math.round((totalAttended / totalClasses) * 100)

export function coursePercent(course: Pick<Course, 'attended' | 'total'>) {
  return Math.round((course.attended / course.total) * 100)
}

export function attendanceOutlook(course: Pick<Course, 'attended' | 'total'>) {
  const ratio = MIN_ATTENDANCE / 100
  if (course.attended / course.total >= ratio) {
    const canMiss = Math.floor(course.attended / ratio - course.total)
    return { safe: true, count: canMiss }
  }
  const mustAttend = Math.ceil((ratio * course.total - course.attended) / (1 - ratio))
  return { safe: false, count: mustAttend }
}

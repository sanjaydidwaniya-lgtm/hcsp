export type TaskStatus = 'YES' | 'NO' | 'PARTIAL' | 'PENDING';
export type TaskType = 'STUDY' | 'REVISION' | 'PYQ' | 'ANSWER WRITING' | 'MOCK TEST' | 'CURRENT AFFAIRS';

export interface SyllabusTopic {
  id: string;
  title: string;
  completed: boolean;
  notes?: string;
}

export interface SyllabusSubSubject {
  id: string;
  name: string;
  topics: SyllabusTopic[];
}

export interface SyllabusSubject {
  id: string;
  name: string;
  subSubjects: SyllabusSubSubject[];
}

export interface HCSTask {
  id: string;
  date: string; // YYYY-MM-DD
  subjectId: string;
  topicTitle: string;
  type: TaskType;
  status: TaskStatus;
  hours: number;
  isRescheduledFrom?: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  status: 'OPEN' | 'CLOSED';
  lockedAt?: string;
  studyHoursTarget: number;
  studyHoursAchieved: number;
  meditationCompleted: boolean; // 15 mins
  exerciseCompleted: boolean;   // 15 mins
  hcsScorePercent: number;
  overallScorePercent: number;
}

export interface CurrentAffairsItem {
  id: string;
  date: string;
  topic: string;
  category: 'National' | 'International' | 'Haryana' | 'Polity' | 'Economy' | 'Environment' | 'Science & Technology' | 'Security' | 'Social Issues';
  notes: string;
  revised: boolean;
}

export interface AnswerWritingItem {
  id: string;
  date: string;
  question: string;
  subject: string;
  wordLimit: number;
  marks: number;
  status: 'Pending' | 'Written' | 'Reviewed';
  answerText?: string;
}

export interface UserProfile {
  name: string;
  examDate: string;
  startDate: string;
  dailyStudyHours: number;
  preferredTime: string;
  restDay: string;
  weakSubjects: string[];
  strongSubjects: string[];
  lifeGoalTarget: number;
  lifeGoalCurrent: number;
}

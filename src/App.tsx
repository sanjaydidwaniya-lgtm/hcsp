import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, CheckCircle2, XCircle, AlertCircle, 
  Flame, Trophy, BookOpen, Target, Dumbbell, Sparkles, Lock, 
  RefreshCw, Home, BarChart2, MoreHorizontal, Clock, Award, FileText, Settings as SettingsIcon
} from 'lucide-react';

import { INITIAL_SYLLABUS } from './data/hcsSyllabus';
import { 
  HCSTask, DailyLog, CurrentAffairsItem, AnswerWritingItem, 
  UserProfile, SyllabusSubject, TaskStatus 
} from './types';

export default function App() {
  const getTodayStr = () => new Date().toISOString().split('T')[0];

  // ================= STATE PERSISTENCE =================
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('hcs_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Sanjay Didwaniya',
      examDate: '2027-02-15',
      startDate: getTodayStr(),
      dailyStudyHours: 8,
      preferredTime: 'Morning',
      restDay: 'Sunday',
      weakSubjects: ['GS-III Economy', 'CSAT Maths'],
      strongSubjects: ['GS-I History', 'Polity'],
      lifeGoalTarget: 2000000000000,
      lifeGoalCurrent: 1500000
    };
  });

  const [syllabus, setSyllabus] = useState<SyllabusSubject[]>(() => {
    const saved = localStorage.getItem('hcs_syllabus');
    return saved ? JSON.parse(saved) : INITIAL_SYLLABUS;
  });

  const [tasks, setTasks] = useState<HCSTask[]>(() => {
    const saved = localStorage.getItem('hcs_tasks');
    if (saved) return JSON.parse(saved);
    // Initial sample task
    return [{
      id: 'task-1',
      date: getTodayStr(),
      subjectId: 'prelims-gs',
      topicTitle: 'Indian Culture & Heritage Overview',
      type: 'STUDY',
      status: 'PENDING',
      hours: 3
    }];
  });

  const [dailyLogs, setDailyLogs] = useState<Record<string, DailyLog>>(() => {
    const saved = localStorage.getItem('hcs_daily_logs');
    return saved ? JSON.parse(saved) : {};
  });

  const [currentAffairs, setCurrentAffairs] = useState<CurrentAffairsItem[]>(() => {
    const saved = localStorage.getItem('hcs_ca');
    return saved ? JSON.parse(saved) : [];
  });

  const [answerWritings, setAnswerWritings] = useState<AnswerWritingItem[]>(() => {
    const saved = localStorage.getItem('hcs_answers');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState<'home' | 'today' | 'plan' | 'progress' | 'more'>('home');
  const [moreSection, setMoreSection] = useState<'ca' | 'aw' | 'life' | 'settings'>('ca');

  // Local Storage Synchronizer
  useEffect(() => {
    localStorage.setItem('hcs_profile', JSON.stringify(profile));
    localStorage.setItem('hcs_syllabus', JSON.stringify(syllabus));
    localStorage.setItem('hcs_tasks', JSON.stringify(tasks));
    localStorage.setItem('hcs_daily_logs', JSON.stringify(dailyLogs));
    localStorage.setItem('hcs_ca', JSON.stringify(currentAffairs));
    localStorage.setItem('hcs_answers', JSON.stringify(answerWritings));
  }, [profile, syllabus, tasks, dailyLogs, currentAffairs, answerWritings]);

  const todayStr = getTodayStr();
  const currentDayLog = dailyLogs[todayStr] || {
    date: todayStr,
    status: 'OPEN',
    studyHoursTarget: profile.dailyStudyHours,
    studyHoursAchieved: 0,
    meditationCompleted: false,
    exerciseCompleted: false,
    hcsScorePercent: 0,
    overallScorePercent: 0
  };

  const isTodayLocked = currentDayLog.status === 'CLOSED';

  // ================= TASK MANAGEMENT =================
  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    if (isTodayLocked) return; // Strict Locking System Rule
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
  };

  const rescheduleMissedTask = (task: HCSTask) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const newTask: HCSTask = {
      ...task,
      id: `task-${Date.now()}`,
      date: tomorrowStr,
      status: 'PENDING',
      isRescheduledFrom: task.id
    };

    setTasks(prev => [...prev, newTask]);
    alert(`Task rescheduled for tomorrow (${tomorrowStr})! Historical task remains LOCKED.`);
  };

  // ================= LOCK TODAY LOGIC =================
  const lockToday = () => {
    const todayTasks = tasks.filter(t => t.date === todayStr);
    const yesCount = todayTasks.filter(t => t.status === 'YES').length;
    const partialCount = todayTasks.filter(t => t.status === 'PARTIAL').length;
    const totalCount = todayTasks.length || 1;

    const hcsScore = Math.round(((yesCount + partialCount * 0.5) / totalCount) * 100);
    const medScore = currentDayLog.meditationCompleted ? 100 : 0;
    const exScore = currentDayLog.exerciseCompleted ? 100 : 0;
    const overallScore = Math.round((hcsScore * 0.6) + (medScore * 0.2) + (exScore * 0.2));

    const updatedLog: DailyLog = {
      ...currentDayLog,
      status: 'CLOSED',
      lockedAt: new Date().toISOString(),
      hcsScorePercent: hcsScore,
      overallScorePercent: overallScore
    };

    setDailyLogs(prev => ({ ...prev, [todayStr]: updatedLog }));
    alert('🔒 TODAY HAS BEEN LOCKED! All entries are now permanent.');
  };

  // ================= CALCULATE STREAKS & STATS =================
  const calculateStreak = () => {
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    const sortedDates = Object.keys(dailyLogs).sort();
    for (const date of sortedDates) {
      if (dailyLogs[date].overallScorePercent >= 80) {
        tempStreak++;
        if (tempStreak > bestStreak) bestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    }
    currentStreak = tempStreak;
    return { currentStreak, bestStreak };
  };

  const { currentStreak, bestStreak } = calculateStreak();

  // Calculate Syllabus Completion %
  const totalTopics = syllabus.flatMap(s => s.subSubjects.flatMap(sub => sub.topics));
  const completedTopics = totalTopics.filter(t => t.completed).length;
  const syllabusPercent = totalTopics.length ? Math.round((completedTopics / totalTopics.length) * 100) : 0;

  // Countdown Calculator
  const getDaysRemaining = () => {
    const diff = new Date(profile.examDate).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col pb-20 md:pb-0 md:flex-row">
      
      {/* SIDEBAR FOR DESKTOP */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-slate-900/50 p-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center font-bold text-amber-400">
            HCS
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide text-amber-400">MY HCS JOURNEY</h1>
            <p className="text-xs text-slate-400">{profile.name}</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {[
            { id: 'home', label: 'Dashboard', icon: Home },
            { id: 'today', label: 'Today Command', icon: Target },
            { id: 'plan', label: 'Syllabus & Plan', icon: BookOpen },
            { id: 'progress', label: 'Analytics', icon: BarChart2 },
            { id: 'more', label: 'Modules & Settings', icon: MoreHorizontal },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === item.id 
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' 
                  : 'text-slate-400 hover:bg-slate-800/50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN VIEW AREA */}
      <main className="flex-1 max-w-5xl mx-auto p-4 md:p-8 w-full overflow-y-auto">
        
        {/* ================= 1. HOME / DASHBOARD ================= */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* HERO CARD */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950/40 p-6 border border-slate-800 shadow-xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                    Target Haryana Civil Services
                  </span>
                  <h1 className="text-2xl md:text-3xl font-extrabold mt-2">Welcome back, {profile.name}</h1>
                  <p className="text-slate-400 text-sm italic mt-1">"Every day is recorded. Yesterday cannot be rewritten."</p>
                </div>
                <div className="bg-slate-900/80 p-4 rounded-xl border border-amber-500/30 text-center min-w-[140px]">
                  <div className="text-3xl font-extrabold text-amber-400">{getDaysRemaining()}</div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">Days to Exam</div>
                </div>
              </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 text-amber-400 mb-1">
                  <Flame className="w-5 h-5" />
                  <span className="text-xs font-medium text-slate-400">Current Streak</span>
                </div>
                <div className="text-2xl font-bold">{currentStreak} Days</div>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                  <Trophy className="w-5 h-5" />
                  <span className="text-xs font-medium text-slate-400">Best Streak</span>
                </div>
                <div className="text-2xl font-bold">{bestStreak} Days</div>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 text-blue-400 mb-1">
                  <BookOpen className="w-5 h-5" />
                  <span className="text-xs font-medium text-slate-400">Syllabus Done</span>
                </div>
                <div className="text-2xl font-bold">{syllabusPercent}%</div>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 text-purple-400 mb-1">
                  <Clock className="w-5 h-5" />
                  <span className="text-xs font-medium text-slate-400">Target Study</span>
                </div>
                <div className="text-2xl font-bold">{profile.dailyStudyHours} hrs/day</div>
              </div>
            </div>

            {/* MANIFESTATION / LIFE GOAL CARD */}
            <div className="bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-900 p-6 rounded-2xl border border-amber-500/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-amber-400 tracking-wide">🌟 MY LONG-TERM WEALTH GOAL</h3>
                </div>
                <span className="text-xs text-amber-300/70 font-mono">MANIFESTATION TARGET</span>
              </div>
              <div className="text-3xl md:text-4xl font-extrabold text-amber-300 font-mono tracking-tight my-2">
                ${profile.lifeGoalTarget.toLocaleString()}
              </div>
              <p className="text-xs text-slate-400 mb-4">Personal motivational milestone tracking long-term independence.</p>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-yellow-300 h-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (profile.lifeGoalCurrent / profile.lifeGoalTarget) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. TODAY COMMAND PAGE ================= */}
        {activeTab === 'today' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Today's Mission</h2>
                <p className="text-xs text-slate-400">{todayStr} • {isTodayLocked ? '🔒 DAY LOCKED' : '🔓 OPEN FOR RECORDING'}</p>
              </div>

              {!isTodayLocked && (
                <button 
                  onClick={lockToday}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-lg transition-all"
                >
                  <Lock className="w-4 h-4" /> LOCK TODAY & CLOSE
                </button>
              )}
            </div>

            {/* HABITS: MEDITATION & EXERCISE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl border transition-all ${currentDayLog.meditationCompleted ? 'bg-emerald-950/30 border-emerald-500/40' : 'bg-slate-900 border-slate-800'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🧘</span>
                    <div>
                      <h4 className="font-bold text-sm">Daily Meditation</h4>
                      <p className="text-xs text-slate-400">15 Minutes Focus Mindset</p>
                    </div>
                  </div>
                  <button
                    disabled={isTodayLocked}
                    onClick={() => setDailyLogs(prev => ({
                      ...prev,
                      [todayStr]: { ...currentDayLog, meditationCompleted: !currentDayLog.meditationCompleted }
                    }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                      currentDayLog.meditationCompleted ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {currentDayLog.meditationCompleted ? 'COMPLETED' : 'MARK DONE'}
                  </button>
                </div>
              </div>

              <div className={`p-4 rounded-xl border transition-all ${currentDayLog.exerciseCompleted ? 'bg-emerald-950/30 border-emerald-500/40' : 'bg-slate-900 border-slate-800'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🏃</span>
                    <div>
                      <h4 className="font-bold text-sm">Daily Exercise</h4>
                      <p className="text-xs text-slate-400">15 Minutes Physical Activity</p>
                    </div>
                  </div>
                  <button
                    disabled={isTodayLocked}
                    onClick={() => setDailyLogs(prev => ({
                      ...prev,
                      [todayStr]: { ...currentDayLog, exerciseCompleted: !currentDayLog.exerciseCompleted }
                    }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                      currentDayLog.exerciseCompleted ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {currentDayLog.exerciseCompleted ? 'COMPLETED' : 'MARK DONE'}
                  </button>
                </div>
              </div>
            </div>

            {/* TODAY'S HCS TASKS */}
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-lg text-amber-400">HCS Daily Target Tasks</h3>

              {tasks.filter(t => t.date === todayStr).length === 0 ? (
                <p className="text-sm text-slate-500 py-4">No HCS tasks generated for today. Add tasks from Syllabus plan.</p>
              ) : (
                <div className="space-y-3">
                  {tasks.filter(t => t.date === todayStr).map(task => (
                    <div key={task.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono uppercase mr-2">{task.type}</span>
                        <h4 className="font-medium text-sm inline-block">{task.topicTitle}</h4>
                        <p className="text-xs text-slate-400 mt-1">{task.hours} Hours planned</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {isTodayLocked ? (
                          <span className={`text-xs px-3 py-1 rounded font-bold ${
                            task.status === 'YES' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            task.status === 'NO' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            task.status === 'PARTIAL' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                            {task.status} (LOCKED)
                          </span>
                        ) : (
                          <>
                            <button
                              onClick={() => updateTaskStatus(task.id, 'YES')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${task.status === 'YES' ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-slate-900 border-slate-700 text-emerald-400'}`}
                            >
                              YES
                            </button>
                            <button
                              onClick={() => updateTaskStatus(task.id, 'PARTIAL')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${task.status === 'PARTIAL' ? 'bg-yellow-500 text-slate-950 border-yellow-400' : 'bg-slate-900 border-slate-700 text-yellow-400'}`}
                            >
                              PARTIAL
                            </button>
                            <button
                              onClick={() => updateTaskStatus(task.id, 'NO')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${task.status === 'NO' ? 'bg-red-500 text-slate-950 border-red-400' : 'bg-slate-900 border-slate-700 text-red-400'}`}
                            >
                              NO
                            </button>
                          </>
                        )}

                        {task.status === 'NO' && (
                          <button
                            onClick={() => rescheduleMissedTask(task)}
                            className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 text-xs flex items-center gap-1"
                            title="Reschedule task for future date"
                          >
                            <RefreshCw className="w-3.5 h-3.5" /> Reschedule
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= 3. SYLLABUS & PLAN ================= */}
        {activeTab === 'plan' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">HCS Syllabus Tree</h2>
              <p className="text-xs text-slate-400">Complete pre-loaded syllabus structure as per Gazette.</p>
            </div>

            {syllabus.map(subject => (
              <div key={subject.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-xl font-bold text-amber-400 tracking-wide">{subject.name}</h3>
                <div className="space-y-4">
                  {subject.subSubjects.map(sub => (
                    <div key={sub.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <h4 className="font-semibold text-slate-200 mb-3">{sub.name}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {sub.topics.map(topic => (
                          <div key={topic.id} className="flex items-center justify-between bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
                            <span className="text-xs text-slate-300">{topic.title}</span>
                            <button
                              onClick={() => {
                                setSyllabus(prev => prev.map(s => ({
                                  ...s,
                                  subSubjects: s.subSubjects.map(ss => ({
                                    ...ss,
                                    topics: ss.topics.map(t => t.id === topic.id ? { ...t, completed: !t.completed } : t)
                                  }))
                                })));
                              }}
                              className={`text-[10px] font-bold px-2 py-1 rounded ${topic.completed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'}`}
                            >
                              {topic.completed ? 'DONE' : 'PENDING'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= 4. ANALYTICS & PROGRESS ================= */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Yearly & Performance Heatmap</h2>
              <p className="text-xs text-slate-400">Truthful, unalterable historical log record.</p>
            </div>

            {/* HEATMAP / CALENDAR GRID */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-sm text-slate-300">Activity Calendar</h3>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 28 }).map((_, idx) => {
                  const day = idx + 1;
                  const dateKey = `2026-09-${day < 10 ? '0' + day : day}`;
                  const log = dailyLogs[dateKey];
                  const score = log?.overallScorePercent || 0;

                  return (
                    <div 
                      key={idx} 
                      className={`h-12 rounded-lg border flex flex-col items-center justify-center text-xs font-mono font-bold transition-all ${
                        score >= 80 ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' :
                        score >= 50 ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300' :
                        log?.status === 'CLOSED' ? 'bg-red-500/20 border-red-500/40 text-red-300' :
                        'bg-slate-950 border-slate-800 text-slate-600'
                      }`}
                    >
                      <span>{day}</span>
                      {log && <span className="text-[9px] opacity-70">{score}%</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= 5. MODULES & SETTINGS ================= */}
        {activeTab === 'more' && (
          <div className="space-y-6">
            <div className="flex gap-2 border-b border-slate-800 pb-3">
              <button onClick={() => setMoreSection('ca')} className={`px-4 py-2 rounded-xl text-xs font-bold ${moreSection === 'ca' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>Current Affairs</button>
              <button onClick={() => setMoreSection('aw')} className={`px-4 py-2 rounded-xl text-xs font-bold ${moreSection === 'aw' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>Answer Writing</button>
              <button onClick={() => setMoreSection('settings')} className={`px-4 py-2 rounded-xl text-xs font-bold ${moreSection === 'settings' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>Settings</button>
            </div>

            {moreSection === 'ca' && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Current Affairs Module</h3>
                <p className="text-xs text-slate-400">Offline current affairs note tracker.</p>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <p className="text-xs text-slate-500">No Current Affairs items added yet. Click to add new notes.</p>
                </div>
              </div>
            )}

            {moreSection === 'settings' && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-lg text-red-400">Data & System Management</h3>
                <button 
                  onClick={() => {
                    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                  className="bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30 px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Clear All Personal Data
                </button>
              </div>
            )}
          </div>
        )}

      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 flex justify-around p-3 z-50">
        {[
          { id: 'home', label: 'Home', icon: Home },
          { id: 'today', label: 'Today', icon: Target },
          { id: 'plan', label: 'Plan', icon: BookOpen },
          { id: 'progress', label: 'Progress', icon: BarChart2 },
          { id: 'more', label: 'More', icon: MoreHorizontal },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`flex flex-col items-center gap-1 ${activeTab === item.id ? 'text-amber-400' : 'text-slate-500'}`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>

    </div>
  );
}

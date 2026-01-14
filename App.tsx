
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Settings, Sparkles, BarChart2, Info, Moon, Sun } from 'lucide-react';
import { Habit, AIAdvice } from './types';
import HabitCard from './components/HabitCard';
import HabitModal from './components/HabitModal';
import StatsView from './components/StatsView';
import { getHabitCoaching } from './services/geminiService';

const App: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('nova_habits');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('nova_theme') as 'light' | 'dark') || 'dark';
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined);
  const [view, setView] = useState<'grid' | 'stats'>('grid');
  const [aiCoach, setAiCoach] = useState<AIAdvice | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    localStorage.setItem('nova_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('nova_theme', theme);
    // Apply background color to body for seamless experience
    document.body.className = theme === 'dark' ? 'bg-black text-white' : 'bg-slate-50 text-slate-900';
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const playSuccessSound = (url: string) => {
    if (url) {
      const audio = new Audio(url);
      audio.play().catch(e => console.log('Audio playback failed', e));
    }
  };

  const toggleHabit = useCallback((id: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === id) {
        const today = new Date().toISOString().split('T')[0];
        const isCurrentlyCompleted = habit.completedDates.includes(today);
        
        if (!isCurrentlyCompleted) {
          playSuccessSound(habit.soundUrl);
          if ('vibrate' in navigator) {
            navigator.vibrate(60);
          }
        }

        const newDates = isCurrentlyCompleted 
          ? habit.completedDates.filter(d => d !== today)
          : [...habit.completedDates, today];
        return { ...habit, completedDates: newDates };
      }
      return habit;
    }));
  }, []);

  const saveHabit = (habit: Habit) => {
    setHabits(prev => {
      const exists = prev.find(h => h.id === habit.id);
      if (exists) {
        return prev.map(h => h.id === habit.id ? habit : h);
      }
      return [...prev, habit];
    });
    setIsModalOpen(false);
    setEditingHabit(undefined);
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    setIsModalOpen(false);
    setEditingHabit(undefined);
  };

  const handleFetchCoach = async () => {
    if (habits.length === 0) return;
    setLoadingAI(true);
    const advice = await getHabitCoaching(habits);
    if (advice) setAiCoach(advice);
    setLoadingAI(false);
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen pb-32 transition-colors duration-300 ${isDark ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Header */}
      <header className={`px-6 pt-12 pb-6 flex justify-between items-center sticky top-0 z-30 border-b backdrop-blur-lg ${isDark ? 'bg-black/80 border-white/5' : 'bg-white/80 border-slate-200'}`}>
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-none">Nova</h1>
          <p className={`text-[10px] font-bold tracking-[0.3em] uppercase mt-1 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Consistency engine</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={toggleTheme}
            className={`p-3 rounded-2xl transition-all ${isDark ? 'bg-white/5 text-white/60' : 'bg-white text-slate-600 shadow-sm border border-slate-200'}`}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            onClick={() => setView(view === 'grid' ? 'stats' : 'grid')}
            className={`p-3 rounded-2xl transition-all ${view === 'stats' ? (isDark ? 'bg-white text-black' : 'bg-slate-900 text-white') : (isDark ? 'bg-white/5 text-white/60' : 'bg-white text-slate-600 shadow-sm border border-slate-200')}`}
          >
            <BarChart2 size={20} />
          </button>
          <button 
            onClick={() => {
              setEditingHabit(undefined);
              setIsModalOpen(true);
            }}
            className={`p-3 rounded-2xl hover:scale-105 active:scale-95 transition-all ${isDark ? 'bg-white text-black' : 'bg-slate-900 text-white'}`}
          >
            <Plus size={20} />
          </button>
        </div>
      </header>

      <main className="px-6 mt-8 max-w-4xl mx-auto">
        {/* AI Motivation Section */}
        {view === 'grid' && (
          <div 
            onClick={handleFetchCoach}
            className={`mb-12 border rounded-3xl p-6 cursor-pointer hover:opacity-90 transition-all relative overflow-hidden group shadow-xl ${isDark ? 'bg-gradient-to-br from-white/10 to-transparent border-white/10' : 'bg-white border-slate-200 shadow-slate-200/50'}`}
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className={isDark ? 'text-white/60' : 'text-slate-400'} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-white/60' : 'text-slate-400'}`}>Insight Neural Engine</span>
              </div>
              {loadingAI ? (
                <div className="space-y-2">
                   <div className={`h-4 rounded w-3/4 animate-pulse ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}></div>
                   <div className={`h-4 rounded w-1/2 animate-pulse ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}></div>
                </div>
              ) : aiCoach ? (
                <div>
                  <p className="text-xl font-black italic tracking-tight leading-tight mb-2">"{aiCoach.encouragement}"</p>
                  <p className={`text-sm leading-relaxed font-medium ${isDark ? 'text-white/50' : 'text-slate-500'}`}>{aiCoach.advice}</p>
                </div>
              ) : (
                <p className="text-lg font-black uppercase tracking-tight">Tap to analyze performance</p>
              )}
            </div>
            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Sparkles size={120} />
            </div>
          </div>
        )}

        {view === 'grid' ? (
          <div className="habit-grid">
            {habits.length > 0 ? (
              habits.map(habit => (
                <HabitCard 
                  key={habit.id} 
                  habit={habit} 
                  theme={theme}
                  onToggle={toggleHabit}
                  onEdit={handleEditHabit}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center space-y-4">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${isDark ? 'bg-white/5 text-white/20' : 'bg-slate-100 text-slate-300'}`}>
                  <Plus size={40} />
                </div>
                <h2 className="text-xl font-black uppercase tracking-widest">Awaiting Objectives</h2>
                <p className={`max-w-xs mx-auto text-sm font-medium ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Add your daily habits to begin tracking your evolution.</p>
              </div>
            )}
          </div>
        ) : (
          <StatsView habits={habits} theme={theme} />
        )}
      </main>

      {/* Floating Instructions */}
      {habits.length > 0 && view === 'grid' && (
         <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl z-20 pointer-events-none transition-all ${isDark ? 'bg-white text-black' : 'bg-slate-900 text-white'}`}>
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">
              Hold to complete • Tap to edit
            </p>
         </div>
      )}

      {/* Modals */}
      {isModalOpen && (
        <HabitModal 
          habit={editingHabit}
          theme={theme}
          onClose={() => {
            setIsModalOpen(false);
            setEditingHabit(undefined);
          }}
          onSave={saveHabit}
          onDelete={deleteHabit}
        />
      )}
    </div>
  );
};

export default App;

import React, { useState, useRef } from 'react';
import { Habit } from '../types';
import { getIcon } from '../constants';
import { Check } from 'lucide-react';

interface HabitCardProps {
  habit: Habit;
  theme: 'light' | 'dark';
  onToggle: (id: string) => void;
  onEdit: (habit: Habit) => void;
}

const LONG_PRESS_DURATION = 800; // ms

const HabitCard: React.FC<HabitCardProps> = ({ habit, theme, onToggle, onEdit }) => {
  const isDark = theme === 'dark';
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completedDates.includes(today);
  
  const [pressProgress, setPressProgress] = useState(0);
  const [isPressing, setIsPressing] = useState(false);
  const timerRef = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const calculateStreak = () => {
    let streak = 0;
    const sortedDates = [...habit.completedDates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    let checkDate = new Date();
    if (!isCompletedToday) checkDate.setDate(checkDate.getDate() - 1);

    for (const date of sortedDates) {
        if (date === checkDate.toISOString().split('T')[0]) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }
    return streak;
  };

  const streak = calculateStreak();

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    setIsPressing(true);
    startTimeRef.current = Date.now();
    
    timerRef.current = window.setTimeout(() => {
      onToggle(habit.id);
      cancelPress();
    }, LONG_PRESS_DURATION);

    const animate = () => {
      if (startTimeRef.current) {
        const elapsed = Date.now() - startTimeRef.current;
        const p = Math.min((elapsed / LONG_PRESS_DURATION) * 100, 100);
        setPressProgress(p);
        if (p < 100) animationRef.current = requestAnimationFrame(animate);
      }
    };
    animationRef.current = requestAnimationFrame(animate);
  };

  const cancelPress = () => {
    setIsPressing(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    timerRef.current = null;
    animationRef.current = null;
    startTimeRef.current = null;
    setPressProgress(0);
  };

  const handlePointerUp = () => {
    if (isPressing && startTimeRef.current) {
      const elapsed = Date.now() - startTimeRef.current;
      if (elapsed < 200) onEdit(habit);
    }
    cancelPress();
  };

  return (
    <div 
      className="flex flex-col items-center gap-3 transition-transform active:scale-95 select-none touch-none" 
      onPointerDown={handlePointerDown} 
      onPointerUp={handlePointerUp} 
      onPointerLeave={cancelPress}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div 
        className={`relative w-32 h-32 rounded-full flex items-center justify-center border-4 overflow-hidden transition-all duration-300 ${isCompletedToday ? 'border-transparent' : (isDark ? 'border-white/10' : 'border-slate-200 bg-white')}`}
        style={{ backgroundColor: isCompletedToday ? habit.color : (isDark ? 'transparent' : 'white'), boxShadow: isCompletedToday ? `0 0 40px ${habit.color}66` : 'none' }}
      >
        {!isCompletedToday && isPressing && (
          <svg className="absolute inset-0 -rotate-90 pointer-events-none" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" stroke={habit.color} strokeWidth="4" strokeDasharray="301.59" strokeDashoffset={301.59 - (301.59 * pressProgress) / 100} strokeLinecap="round" />
          </svg>
        )}

        {isCompletedToday ? (
          <Check className={`w-14 h-14 stroke-[4px] ${isDark ? 'text-black' : 'text-white'}`} />
        ) : (
          <div className={`text-4xl transition-transform ${isPressing ? 'scale-110' : ''}`} style={{ color: isPressing ? habit.color : (isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)') }}>
            {getIcon(habit.icon)}
          </div>
        )}
      </div>
      <div className="text-center">
        <h3 className={`font-extrabold text-sm uppercase tracking-widest truncate w-32 ${isDark ? 'text-white' : 'text-slate-800'}`}>{habit.name}</h3>
        <p className={`text-[10px] font-black mt-1 tracking-widest ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
          {isCompletedToday ? 'COMPLETED' : streak > 0 ? `${streak} DAY STREAK` : 'HOLD TO START'}
        </p>
      </div>
    </div>
  );
};

export default HabitCard;
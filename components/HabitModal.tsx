
import React, { useState } from 'react';
import { Habit, Frequency } from '../types';
import { COLORS, ICONS, SOUNDS, getIcon } from '../constants';
import { X, Trash2, Volume2, Play, AlertCircle } from 'lucide-react';

interface HabitModalProps {
  habit?: Habit;
  theme: 'light' | 'dark';
  onClose: () => void;
  onSave: (habit: Habit) => void;
  onDelete?: (id: string) => void;
}

const HabitModal: React.FC<HabitModalProps> = ({ habit, theme, onClose, onSave, onDelete }) => {
  const isDark = theme === 'dark';
  const [name, setName] = useState(habit?.name || '');
  const [selectedIcon, setSelectedIcon] = useState(habit?.icon || ICONS[0].id);
  const [selectedColor, setSelectedColor] = useState(habit?.color || COLORS[0]);
  const [selectedSound, setSelectedSound] = useState(habit?.soundUrl || SOUNDS[0].url);
  const [frequency, setFrequency] = useState<Frequency>(habit?.frequency || 'daily');
  
  // State for the two-step delete confirmation
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const previewSound = (url: string) => {
    const audio = new Audio(url);
    audio.play().catch(e => console.error("Sound preview failed", e));
    setSelectedSound(url);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    
    const newHabit: Habit = {
      id: habit?.id || crypto.randomUUID(),
      name,
      icon: selectedIcon,
      color: selectedColor,
      soundUrl: selectedSound,
      frequency,
      targetCount: 1,
      completedDates: habit?.completedDates || [],
      createdAt: habit?.createdAt || new Date().toISOString(),
    };
    onSave(newHabit);
  };

  const handleDelete = () => {
    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);
      // Reset confirmation after 3 seconds if not clicked
      setTimeout(() => setIsConfirmingDelete(false), 3000);
    } else {
      if (habit && onDelete) {
        onDelete(habit.id);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity">
      <div className={`w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border transition-colors ${isDark ? 'bg-[#111] border-white/10' : 'bg-white border-slate-200'}`}>
        <div className={`p-6 border-b flex justify-between items-center ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
          <h2 className={`text-xl font-extrabold uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {habit ? 'Configure Habit' : 'Initiate Habit'}
          </h2>
          <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-white/60' : 'hover:bg-slate-100 text-slate-400'}`}>
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Name Input */}
          <section>
            <label className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-3 block ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Identify Task</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Read 10 Pages"
              className={`w-full rounded-2xl p-4 text-lg font-bold focus:outline-none transition-all border ${isDark ? 'bg-white/5 border-white/10 text-white focus:border-white/30' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-400'}`}
            />
          </section>

          {/* Icon Selector */}
          <section>
            <label className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-3 block ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Visual Marker</label>
            <div className="grid grid-cols-6 gap-2">
              {ICONS.map(icon => (
                <button
                  key={icon.id}
                  onClick={() => setSelectedIcon(icon.id)}
                  className={`flex items-center justify-center p-3 rounded-xl transition-all ${
                    selectedIcon === icon.id 
                      ? (isDark ? 'bg-white text-black' : 'bg-slate-900 text-white') 
                      : (isDark ? 'bg-white/5 text-white/60 hover:bg-white/10' : 'bg-slate-50 text-slate-400 hover:bg-slate-100')
                  }`}
                >
                  {icon.component}
                </button>
              ))}
            </div>
          </section>

          {/* Sound Selector */}
          <section>
            <label className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-3 block flex items-center gap-2 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
              <Volume2 size={12} /> Victory Resonance
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SOUNDS.map(sound => (
                <button
                  key={sound.id}
                  onClick={() => previewSound(sound.url)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest ${
                    selectedSound === sound.url 
                      ? 'bg-indigo-500 text-white' 
                      : (isDark ? 'bg-white/5 text-white/40 hover:bg-white/10' : 'bg-slate-50 text-slate-400 hover:bg-slate-100')
                  }`}
                >
                  <span>{sound.name}</span>
                  <Play size={10} fill={selectedSound === sound.url ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
          </section>

          {/* Color Selector */}
          <section>
            <label className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-3 block ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Core Spectrum</label>
            <div className="grid grid-cols-5 gap-3">
              {COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`h-10 rounded-full border-2 transition-transform active:scale-90 ${
                    selectedColor === color 
                      ? (isDark ? 'border-white scale-110' : 'border-slate-900 scale-110') 
                      : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </section>

          {/* Frequency Selector */}
          <section>
            <label className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-3 block ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Occurrence</label>
            <div className="flex gap-2">
              {(['daily', 'weekly', 'monthly'] as Frequency[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFrequency(f)}
                  className={`flex-1 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all ${
                    frequency === f 
                      ? (isDark ? 'bg-white text-black' : 'bg-slate-900 text-white') 
                      : (isDark ? 'bg-white/5 text-white/40 hover:bg-white/10' : 'bg-slate-50 text-slate-400 hover:bg-slate-100')
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className={`p-6 flex gap-3 ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
          {/* Delete Action with two-step confirmation */}
          {habit && onDelete && (
            <button 
              onClick={handleDelete}
              className={`flex items-center justify-center px-4 rounded-2xl transition-all border ${
                isConfirmingDelete 
                ? 'bg-red-600 text-white border-red-700 w-auto' 
                : (isDark ? 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white' : 'bg-red-50 text-red-500 border-red-200 hover:bg-red-500 hover:text-white')
              }`}
            >
              {isConfirmingDelete ? (
                <div className="flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest px-2">
                  <AlertCircle size={18} />
                  <span>Tap again to Confirm</span>
                </div>
              ) : (
                <Trash2 size={24} />
              )}
            </button>
          )}
          <button 
            onClick={handleSave}
            className={`flex-1 font-black py-4 rounded-2xl uppercase tracking-[0.2em] hover:opacity-90 active:scale-95 transition-all ${isDark ? 'bg-white text-black' : 'bg-slate-900 text-white'}`}
          >
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
};

export default HabitModal;

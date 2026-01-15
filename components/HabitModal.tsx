import React, { useState } from 'react';
import { Habit, Frequency } from '../types';
import { COLORS, ICONS, SOUNDS } from '../constants';
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
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const previewSound = (url: string) => {
    new Audio(url).play().catch(e => console.error(e));
    setSelectedSound(url);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: habit?.id || crypto.randomUUID(),
      name,
      icon: selectedIcon,
      color: selectedColor,
      soundUrl: selectedSound,
      frequency,
      targetCount: 1,
      completedDates: habit?.completedDates || [],
      createdAt: habit?.createdAt || new Date().toISOString(),
    });
  };

  const handleDelete = () => {
    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);
      setTimeout(() => setIsConfirmingDelete(false), 3000);
    } else if (habit && onDelete) {
      onDelete(habit.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className={`w-full max-w-lg rounded-3xl overflow-hidden border transition-colors ${isDark ? 'bg-[#111] border-white/10' : 'bg-white border-slate-200 shadow-2xl'}`}>
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-extrabold uppercase tracking-widest">Configure Habit</h2>
          <button onClick={onClose} className="p-2"><X size={24} /></button>
        </div>
        <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
          <section>
            <label className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-3 block ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Identify Task</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className={`w-full p-4 rounded-2xl text-lg font-bold border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`} 
              placeholder="e.g. Morning Meditation" 
            />
          </section>
          
          <section>
            <label className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-3 block ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Visual Marker</label>
            <div className="grid grid-cols-6 gap-2">
              {ICONS.map(icon => (
                <button key={icon.id} onClick={() => setSelectedIcon(icon.id)} className={`p-3 rounded-xl transition-all ${selectedIcon === icon.id ? (isDark ? 'bg-white text-black' : 'bg-slate-900 text-white') : 'bg-white/5'}`}>{icon.component}</button>
              ))}
            </div>
          </section>

          <section>
            <label className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-3 block ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Success Tone</label>
            <div className="grid grid-cols-2 gap-2">
              {SOUNDS.map(sound => (
                <button key={sound.id} onClick={() => previewSound(sound.url)} className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest ${selectedSound === sound.url ? 'bg-indigo-500 text-white' : 'bg-white/5 text-white/40'}`}>
                  <span>{sound.name}</span>
                  <Play size={10} fill={selectedSound === sound.url ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
          </section>

          <section>
            <label className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-3 block ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Core Spectrum</label>
            <div className="grid grid-cols-5 gap-3">
              {COLORS.map(color => (
                <button key={color} onClick={() => setSelectedColor(color)} className={`h-10 rounded-full border-2 ${selectedColor === color ? (isDark ? 'border-white' : 'border-slate-900') : 'border-transparent'}`} style={{ backgroundColor: color }} />
              ))}
            </div>
          </section>
        </div>
        <div className="p-6 flex gap-3">
          {habit && (
            <button onClick={handleDelete} className={`px-4 rounded-2xl border transition-all ${isConfirmingDelete ? 'bg-red-600 text-white' : 'bg-red-500/10 text-red-500 border-red-500/10'}`}>
              {isConfirmingDelete ? <AlertCircle /> : <Trash2 />}
            </button>
          )}
          <button onClick={handleSave} className={`flex-1 font-black py-4 rounded-2xl uppercase tracking-widest active:scale-95 transition-all ${isDark ? 'bg-white text-black' : 'bg-slate-900 text-white'}`}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default HabitModal;
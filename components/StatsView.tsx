
import React from 'react';
import { Habit } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface StatsViewProps {
  habits: Habit[];
  theme: 'light' | 'dark';
}

const StatsView: React.FC<StatsViewProps> = ({ habits, theme }) => {
  const isDark = theme === 'dark';

  // Aggregate data for the last 7 days
  const getLast7DaysData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = habits.filter(h => h.completedDates.includes(dateStr)).length;
      data.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: count,
      });
    }
    return data;
  };

  const data = getLast7DaysData();

  return (
    <div className={`rounded-3xl p-6 border transition-colors ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
      <div className="mb-6">
        <h3 className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Activity Last 7 Days</h3>
        <p className={`text-2xl font-black mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Total Completion</p>
      </div>
      
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis 
              dataKey="name" 
              stroke={isDark ? "#666" : "#94a3b8"} 
              fontSize={10} 
              axisLine={false} 
              tickLine={false} 
            />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDark ? '#111' : '#fff', 
                border: isDark ? '1px solid #333' : '1px solid #e2e8f0', 
                borderRadius: '12px',
                color: isDark ? '#fff' : '#000'
              }}
              itemStyle={{ color: isDark ? '#fff' : '#000' }}
            />
            <Line 
              type="monotone" 
              dataKey="completed" 
              stroke={isDark ? "#fff" : "#0f172a"} 
              strokeWidth={4} 
              dot={{ fill: isDark ? '#fff' : '#0f172a', r: 4 }} 
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">
        <div className={`p-4 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-slate-50 border border-slate-100'}`}>
          <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Active Habits</p>
          <p className="text-2xl font-black">{habits.length}</p>
        </div>
        <div className={`p-4 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-slate-50 border border-slate-100'}`}>
          <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Engagement</p>
          <p className="text-2xl font-black">
            {habits.length > 0 ? Math.round((habits.filter(h => h.completedDates.includes(new Date().toISOString().split('T')[0])).length / habits.length) * 100) : 0}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsView;

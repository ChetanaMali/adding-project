import React from 'react';
import { 
  Dumbbell, 
  Book, 
  Droplets, 
  Moon, 
  Utensils, 
  Brain, 
  Code, 
  Music, 
  Camera, 
  Heart, 
  Zap, 
  Flame 
} from 'lucide-react';

export const COLORS = [
  '#FF5733', // Sunset Orange
  '#33FF57', // Emerald Green
  '#3357FF', // Royal Blue
  '#F333FF', // Fuchsia
  '#FFD700', // Gold
  '#00CED1', // Dark Turquoise
  '#FF69B4', // Hot Pink
  '#8A2BE2', // Blue Violet
  '#FF4500', // Orange Red
  '#32CD32', // Lime Green
];

export const SOUNDS = [
  { id: 'achievement', name: 'Achievement', url: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3' },
  { id: 'bell', name: 'Soft Bell', url: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3' },
  { id: 'chime', name: 'Magic Chime', url: 'https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3' },
  { id: 'pop', name: 'Bubble Pop', url: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3' },
  { id: 'tinkle', name: 'Tinkle', url: 'https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3' },
  { id: 'level-up', name: 'Level Up', url: 'https://assets.mixkit.co/active_storage/sfx/2015/2015-preview.mp3' },
  { id: 'shimmer', name: 'Shimmer', url: 'https://assets.mixkit.co/active_storage/sfx/2016/2016-preview.mp3' },
  { id: 'bright', name: 'Bright Ding', url: 'https://assets.mixkit.co/active_storage/sfx/2014/2014-preview.mp3' },
];

export const ICONS = [
  { id: 'dumbbell', component: React.createElement(Dumbbell) },
  { id: 'book', component: React.createElement(Book) },
  { id: 'droplets', component: React.createElement(Droplets) },
  { id: 'moon', component: React.createElement(Moon) },
  { id: 'utensils', component: React.createElement(Utensils) },
  { id: 'brain', component: React.createElement(Brain) },
  { id: 'code', component: React.createElement(Code) },
  { id: 'music', component: React.createElement(Music) },
  { id: 'camera', component: React.createElement(Camera) },
  { id: 'heart', component: React.createElement(Heart) },
  { id: 'zap', component: React.createElement(Zap) },
  { id: 'flame', component: React.createElement(Flame) },
];

export const getIcon = (id: string) => {
  const icon = ICONS.find(i => i.id === id);
  return icon ? icon.component : React.createElement(Zap);
};
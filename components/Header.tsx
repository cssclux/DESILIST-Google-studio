import React from 'react';
import { GlobeAltIcon, UserCircleIcon, PlusIcon, SunIcon, MoonIcon } from './icons/Icons';

interface HeaderProps {
  onPostAdClick: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onPostAdClick, theme, onToggleTheme }) => {
  return (
    <header className="bg-primary shadow-md sticky top-0 z-20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <a href="#" className="text-2xl font-bold text-white">AfriList</a>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-slate-200 hover:text-white font-medium">All Ads</a>
            <a href="#" className="text-slate-200 hover:text-white font-medium">Categories</a>
            <a href="#" className="text-slate-200 hover:text-white font-medium">Help</a>
          </div>
          <div className="flex items-center space-x-4">
             <button onClick={onToggleTheme} className="text-white hover:bg-black/10 p-2 rounded-full transition-colors duration-200">
              {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
            </button>
            <button className="hidden md:flex items-center text-slate-200 hover:text-white">
              <GlobeAltIcon className="h-5 w-5 mr-1" />
              <span>EN</span>
            </button>
            <button className="flex items-center text-slate-200 hover:text-white">
              <UserCircleIcon className="h-7 w-7" />
              <span className="hidden md:inline ml-1 font-medium">Login / Register</span>
            </button>
            <button 
              onClick={onPostAdClick}
              className="flex items-center bg-secondary text-gray-900 font-bold py-2 px-4 rounded-md hover:bg-yellow-300 transition-all duration-300 shadow-md hover:shadow-[0_0_15px_rgba(250,204,21,0.6)]"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              <span>Post Ad</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
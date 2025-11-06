import React from 'react';
import { Link } from 'react-router-dom';
import type { User } from '../types';
import { ArrowLeftOnRectangleIcon } from './icons/Icons';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  currentUser: User | null;
  onPostAdClick: () => void;
  onLoginClick: () => void;
  onLogout: () => void;
  theme: string;
  onThemeToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentUser, onPostAdClick, onLoginClick, onLogout, theme, onThemeToggle }) => {
  return (
    <header className="bg-primary sticky top-0 z-40 border-b border-primary-dark shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="text-4xl font-extrabold text-white tracking-tight">
            OJA<span className="font-light text-slate-200">.ng</span>
          </Link>
          <div className="flex items-center space-x-4">
            <ThemeToggle theme={theme} onToggle={onThemeToggle} />
            {currentUser ? (
               <div className="flex items-center space-x-3">
                 <Link to={`/profile/${currentUser.email}`} className="flex items-center space-x-3 group">
                   <span className="hidden md:inline text-slate-100 font-medium group-hover:text-white transition-colors">
                     Welcome, {currentUser.name.split(' ')[0]}!
                   </span>
                   <img src={currentUser.avatarUrl || `https://i.pravatar.cc/150?u=${currentUser.email}`} alt={currentUser.name} className="h-9 w-9 rounded-full border-2 border-white/20 group-hover:border-white transition-colors" />
                 </Link>
                 <button
                   onClick={onLogout}
                   className="text-slate-200 hover:text-white transition-colors"
                   title="Log Out"
                 >
                   <ArrowLeftOnRectangleIcon className="h-6 w-6" />
                 </button>
               </div>
            ) : (
                <button
                onClick={onLoginClick}
                className="hidden md:inline-block text-slate-100 hover:text-white transition-colors font-semibold"
              >
                Log In / Register
              </button>
            )}

            <button
              onClick={onPostAdClick}
              className="bg-white text-primary hover:bg-slate-200 font-bold py-2 px-6 rounded-lg shadow-md transition-colors"
            >
              Post Ad
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
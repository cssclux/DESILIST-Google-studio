import React from 'react';
import { GlobeAltIcon, UserCircleIcon, PlusIcon } from './icons/Icons';

interface HeaderProps {
  onPostAdClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onPostAdClick }) => {
  return (
    <header className="bg-primary shadow-md sticky top-0 z-20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <a href="#" className="text-2xl font-bold text-white">AfriList</a>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-white/90 hover:text-white font-medium">All Ads</a>
            <a href="#" className="text-white/90 hover:text-white font-medium">Categories</a>
            <a href="#" className="text-white/90 hover:text-white font-medium">Help</a>
          </div>
          <div className="flex items-center space-x-4">
            <button className="hidden md:flex items-center text-white/90 hover:text-white">
              <GlobeAltIcon className="h-5 w-5 mr-1" />
              <span>EN</span>
            </button>
            <button className="flex items-center text-white/90 hover:text-white">
              <UserCircleIcon className="h-7 w-7" />
              <span className="hidden md:inline ml-1">Log In</span>
            </button>
            <button 
              onClick={onPostAdClick}
              className="flex items-center bg-white text-primary font-bold py-2 px-4 rounded-full hover:bg-slate-100 transition duration-300 shadow-sm"
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
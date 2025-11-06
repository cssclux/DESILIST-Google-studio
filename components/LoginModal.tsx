import React, { useState } from 'react';
import { XMarkIcon, GoogleIcon } from './icons/Icons';
import type { User } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetLinkSent, setIsResetLinkSent] = useState(false);
  const [emailForReset, setEmailForReset] = useState('');

  if (!isOpen) return null;

  const handleSimulatedLogin = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    // In a real app, this would trigger an OAuth flow or validate credentials.
    // For this simulation, we'll create and return a mock user.
    const mockUser: User = {
      name: 'Tunde Ojo',
      email: 'tunde.ojo@example.com',
      phone: '08011223344',
      avatarUrl: `https://i.pravatar.cc/150?u=tunde.ojo@example.com`,
      joinDate: new Date().toISOString(),
      reviews: [],
    };
    onLoginSuccess(mockUser);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Password reset requested for: ${emailForReset}`);
    // Simulate API call
    setIsResetLinkSent(true);
  };

  const handleClose = () => {
    setIsForgotPassword(false);
    setIsResetLinkSent(false);
    setEmailForReset('');
    onClose();
  };

  const renderLoginView = () => (
    <>
      <div className="p-6 border-b border-white/10 dark:border-slate-700/50 text-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Join OJA.ng</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sign in to continue</p>
          <button onClick={handleClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
              <XMarkIcon className="h-6 w-6" />
          </button>
      </div>
      
      <div className="p-8 space-y-6">
          <button
              type="button"
              onClick={handleSimulatedLogin}
              className="w-full flex items-center justify-center py-3 px-4 border border-slate-300 dark:border-slate-600 rounded-full shadow-sm text-base font-medium text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none transition-colors"
          >
              <GoogleIcon className="h-6 w-6 mr-3" />
              Sign in with Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white/30 dark:bg-slate-900/40 px-2 text-gray-500 dark:text-gray-400 backdrop-blur-sm">Or continue with email</span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSimulatedLogin}>
              <div>
                  <label htmlFor="email" className="sr-only">Email Address</label>
                  <input type="email" id="email" className="block w-full input" placeholder="Email Address" required />
              </div>
              <div>
                  <label htmlFor="password"  className="sr-only">Password</label>
                  <input type="password" id="password" className="block w-full input" placeholder="Password" required />
              </div>
              <div className="text-right -mt-2">
                <button 
                  type="button" 
                  onClick={() => setIsForgotPassword(true)} 
                  className="text-sm font-medium text-primary hover:text-primary-dark dark:hover:text-teal-400 hover:underline focus:outline-none"
                >
                    Forgot Password?
                </button>
              </div>
              <div className="pt-2">
                  <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark transition-colors">
                      Sign in
                  </button>
              </div>
          </form>
      </div>
    </>
  );

  const renderForgotPasswordView = () => (
    <>
      <div className="p-6 border-b border-white/10 dark:border-slate-700/50 text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Reset Password</h2>
        {!isResetLinkSent && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Enter your email to get a reset link.</p>}
        <button onClick={handleClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
            <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
      <div className="p-8 space-y-6">
        {isResetLinkSent ? (
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-300">If an account with that email exists, a password reset link has been sent.</p>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleForgotPasswordSubmit}>
            <div>
                <label htmlFor="reset-email" className="sr-only">Email Address</label>
                <input 
                  type="email" 
                  id="reset-email" 
                  className="block w-full input" 
                  placeholder="Email Address" 
                  value={emailForReset}
                  onChange={(e) => setEmailForReset(e.target.value)}
                  required 
                />
            </div>
            <div>
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark transition-colors">
                    Send Reset Link
                </button>
            </div>
          </form>
        )}
        <div className="text-center">
            <button type="button" onClick={() => { setIsForgotPassword(false); setIsResetLinkSent(false); }} className="text-sm font-medium text-primary hover:text-primary-dark dark:hover:text-teal-400 hover:underline focus:outline-none">
                Back to Login
            </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={handleClose}>
      <div className="glass-card w-full max-w-md relative animate-fade-in-down overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {isForgotPassword ? renderForgotPasswordView() : renderLoginView()}
      </div>
    </div>
  );
};

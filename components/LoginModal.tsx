
import React, { useState, useEffect } from 'react';
import { XMarkIcon, GoogleIcon } from './icons/Icons';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmailLogin: (credentials: { email: string; password: string }) => Promise<void>;
  onEmailSignUp: (details: { name: string; email: string; password: string }) => Promise<void>;
  onGoogleLogin: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onEmailLogin, onEmailSignUp, onGoogleLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (!isOpen) {
        // Reset state when modal is closed to ensure clean state on reopen
        setTimeout(() => {
            setMode('login');
            setEmail('');
            setName('');
            setPassword('');
            setError('');
            setIsLoading(false);
        }, 200); // Delay to allow fade-out animation
    }
  }, [isOpen]);

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'signup' : 'login');
    // Reset fields and errors when switching modes
    setEmail('');
    setName('');
    setPassword('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await onEmailLogin({ email, password });
      } else {
        await onEmailSignUp({ name, email, password });
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="glass-card w-full max-w-md relative animate-fade-in-down" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            {mode === 'login' ? 'Welcome Back!' : 'Create an Account'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {mode === 'login' ? 'Log in to continue to OJA.ng' : 'Get started with OJA.ng today'}
          </p>
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
            <button 
                type="button"
                onClick={onGoogleLogin}
                className="w-full flex justify-center items-center gap-3 py-2.5 px-4 border border-slate-300 dark:border-slate-600 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
                <GoogleIcon className="h-5 w-5"/>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Continue with Google</span>
            </button>

            <div className="flex items-center">
                <div className="flex-grow border-t border-slate-300 dark:border-slate-700"></div>
                <span className="flex-shrink mx-4 text-xs text-slate-400 dark:text-slate-500 uppercase">OR</span>
                <div className="flex-grow border-t border-slate-300 dark:border-slate-700"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full input" placeholder="e.g., Ada Okoro" required />
                    </div>
                )}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full input" placeholder="you@example.com" required />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full input" placeholder="••••••••" required />
                </div>

                {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                <div className="pt-2">
                    <button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-full shadow-md hover:shadow-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-wait">
                        {isLoading ? 'Processing...' : (mode === 'login' ? 'Log In' : 'Sign Up')}
                    </button>
                </div>
            </form>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                <button onClick={toggleMode} className="ml-1 font-semibold text-primary hover:underline">
                    {mode === 'login' ? "Sign Up" : "Log In"}
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { GoogleIcon } from './icons/GoogleIcon';

interface LoginScreenProps {
  onSignIn: () => void;
  error: string | null;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSignIn, error }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-dark-bg">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 h-16 w-16 flex items-center justify-center rounded-full bg-dark-surface">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-dark-text-secondary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
        </div>
        <h1 className="text-3xl font-bold text-dark-text-primary">Gmail Inbox Viewer</h1>
        <p className="mt-2 text-dark-text-secondary">
          A clean, modern interface for your Gmail account.
        </p>
        <div className="mt-8">
          <button
            onClick={onSignIn}
            className="w-full inline-flex justify-center items-center gap-3 px-6 py-3 bg-brand-blue text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue focus:ring-offset-dark-bg transition-all duration-200"
          >
            <GoogleIcon className="w-6 h-6" />
            <span>Connect with Google</span>
          </button>
        </div>
        {error && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-lg">
                <p>{error}</p>
            </div>
        )}
        <p className="mt-8 text-xs text-gray-500">
            Clicking the button will prompt you to sign in with Google and grant permission to read your emails. This application does not store your data.
        </p>
      </div>
    </div>
  );
};

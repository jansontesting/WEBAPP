
import React from 'react';
import type { Email } from '../types';
import { ReplyIcon } from './icons/ReplyIcon';

interface EmailDetailProps {
  email: Email;
}

export const EmailDetail: React.FC<EmailDetailProps> = ({ email }) => {
  return (
    <div className="h-full flex flex-col">
      <header className="p-4 border-b border-dark-border flex-shrink-0">
        <h1 className="text-xl font-bold text-dark-text-primary mb-2">{email.subject}</h1>
        <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-brand-green flex items-center justify-center text-white font-bold text-lg">
                {email.from.charAt(0)}
            </div>
            <div className="ml-3">
                <p className="font-semibold text-dark-text-primary">{email.from} <span className="text-sm font-normal text-dark-text-secondary">&lt;{email.fromEmail}&gt;</span></p>
                <p className="text-sm text-dark-text-secondary">to me</p>
            </div>
            <div className="ml-auto text-sm text-dark-text-secondary">{email.date}</div>
        </div>
      </header>
      <div className="flex-grow overflow-y-auto p-6 prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: email.body }}>
      </div>
       <footer className="p-4 border-t border-dark-border flex-shrink-0">
         <button className="flex items-center gap-2 px-4 py-2 border border-dark-border rounded-full text-sm font-semibold hover:bg-dark-surface transition-colors">
            <ReplyIcon className="w-4 h-4" />
            Reply
         </button>
      </footer>
    </div>
  );
};

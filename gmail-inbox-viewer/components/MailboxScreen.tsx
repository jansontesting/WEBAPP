import React, { useState, useEffect, useCallback } from 'react';
import type { UserProfile, Email } from '../types';
import { gmailService } from '../services/gmailService';
import { EmailList } from './EmailList';
import { EmailDetail } from './EmailDetail';
import { Spinner } from './Spinner';
import { LogoutIcon } from './icons/LogoutIcon';
import { ComposeIcon } from './icons/ComposeIcon';


interface MailboxScreenProps {
  user: UserProfile;
  accessToken: string;
  onSignOut: () => void;
}

export const MailboxScreen: React.FC<MailboxScreenProps> = ({ user, accessToken, onSignOut }) => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmails = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const fetchedEmails = await gmailService.listEmails(accessToken);
      setEmails(fetchedEmails);
      if (fetchedEmails.length > 0) {
        setSelectedEmail(fetchedEmails[0]);
      } else {
        setSelectedEmail(null);
      }
    } catch (err) {
      const error = err as Error;
      setError(`Failed to fetch emails: ${error.message}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  return (
    <div className="flex h-screen w-full bg-dark-bg text-dark-text-primary">
      {/* Sidebar */}
      <aside className="w-1/3 max-w-sm flex-shrink-0 bg-dark-surface border-r border-dark-border flex flex-col">
        <div className="p-4 border-b border-dark-border flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <img src={user.picture} alt="User" className="w-9 h-9 rounded-full flex-shrink-0" />
            <div className="truncate">
                <h2 className="font-semibold text-white truncate">{user.name}</h2>
                <p className="text-sm text-dark-text-secondary truncate">{user.email}</p>
            </div>
          </div>
          <button onClick={onSignOut} className="p-2 rounded-full hover:bg-gray-600 transition-colors flex-shrink-0 ml-2" title="Sign Out">
            <LogoutIcon className="w-5 h-5 text-dark-text-secondary" />
          </button>
        </div>
        <div className="p-4">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-blue text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors">
                <ComposeIcon className="w-5 h-5"/>
                <span>Compose</span>
            </button>
        </div>
        {isLoading ? (
          <div className="flex-grow flex items-center justify-center">
            <Spinner />
          </div>
        ) : error ? (
            <div className="p-4 m-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-sm">{error}</div>
        ) : (
          <EmailList emails={emails} onSelectEmail={setSelectedEmail} selectedEmailId={selectedEmail?.id ?? ''}/>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {selectedEmail ? (
          <EmailDetail email={selectedEmail} />
        ) : (
          <div className="flex items-center justify-center h-full text-dark-text-secondary">
            {isLoading ? <Spinner/> : <p>No emails found or selected.</p>}
          </div>
        )}
      </main>
    </div>
  );
};

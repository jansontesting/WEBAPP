
import React from 'react';
import type { Email } from '../types';
import { EmailListItem } from './EmailListItem';

interface EmailListProps {
  emails: Email[];
  selectedEmailId: string;
  onSelectEmail: (email: Email) => void;
}

export const EmailList: React.FC<EmailListProps> = ({ emails, selectedEmailId, onSelectEmail }) => {
  return (
    <nav className="flex-1 overflow-y-auto">
      <ul>
        {emails.map(email => (
          <EmailListItem
            key={email.id}
            email={email}
            isSelected={email.id === selectedEmailId}
            onSelect={() => onSelectEmail(email)}
          />
        ))}
      </ul>
    </nav>
  );
};

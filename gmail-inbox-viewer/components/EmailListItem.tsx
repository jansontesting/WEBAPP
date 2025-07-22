
import React from 'react';
import type { Email } from '../types';

interface EmailListItemProps {
  email: Email;
  isSelected: boolean;
  onSelect: () => void;
}

export const EmailListItem: React.FC<EmailListItemProps> = ({ email, isSelected, onSelect }) => {
  const baseClasses = "block w-full text-left px-4 py-3 border-b border-dark-border cursor-pointer transition-colors duration-150";
  const selectedClasses = "bg-brand-blue/20";
  const unselectedClasses = "hover:bg-gray-600/50";

  return (
    <li>
      <button onClick={onSelect} className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}>
        <div className="flex justify-between items-baseline mb-1">
          <h3 className={`font-semibold truncate ${isSelected ? 'text-white' : 'text-dark-text-primary'}`}>{email.from}</h3>
          <p className="text-xs text-dark-text-secondary flex-shrink-0 ml-2">{email.date}</p>
        </div>
        <p className={`text-sm truncate font-medium ${isSelected ? 'text-white' : 'text-dark-text-primary'}`}>{email.subject}</p>
        <p className="text-sm text-dark-text-secondary truncate">{email.snippet}</p>
      </button>
    </li>
  );
};


import React from 'react';
import { LeadStatus } from '../types';

interface Props {
  status: LeadStatus;
}

const LeadStatusBadge: React.FC<Props> = ({ status }) => {
  let colorClass = '';

  switch (status) {
    case LeadStatus.NEW:
      colorClass = 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      break;
    case LeadStatus.FOLLOW_UP:
      colorClass = 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
      break;
    case LeadStatus.CALLED:
      colorClass = 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      break;
    case LeadStatus.NOT_CONTACTED:
      colorClass = 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
      break;
    case LeadStatus.NOT_INTERESTED:
      colorClass = 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      break;
    default:
      colorClass = 'bg-gray-100 text-gray-700';
  }

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold inline-flex items-center ${colorClass}`}>
      {status}
    </span>
  );
};

export default LeadStatusBadge;

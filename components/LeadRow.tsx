import React from 'react';
import { Lead, LeadStatus } from '../types';
import { Phone, Mail, MapPin, Home, MoreVertical } from 'lucide-react';

interface LeadRowProps {
  lead: Lead;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onToggleContact: (id: string, type: 'phone' | 'email') => void;
}

const LeadRow: React.FC<LeadRowProps> = ({ lead, onUpdateStatus, onToggleContact }) => {
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(date);
  };

  const getRelativeTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const hrs = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hrs / 24);
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hrs > 0) return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const propertyTypeStyles = {
    'Rented Apartment': 'bg-purple-100 text-purple-700',
    'Apartment': 'bg-teal-100 text-teal-700',
    'House/Land': 'bg-pink-100 text-pink-700'
  };

  // Sanitize phone number for tel: links
  const sanitizedPhone = lead.phoneNumber.replace(/\D/g, '');

  return (
    <div className="grid grid-cols-12 gap-4 px-6 py-6 border-b border-slate-100 hover:bg-slate-50 transition-colors duration-150 items-start group">
      {/* Date Column */}
      <div className="col-span-12 md:col-span-2 flex flex-col">
        <span className="text-sm font-bold text-slate-800">
          {lead.date.toDateString() === new Date().toDateString() ? 'Today' : formatDate(lead.date)}
        </span>
        <span className="text-xs text-slate-500">{formatTime(lead.date)}</span>
        <span className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded w-max ${
          getRelativeTime(lead.date).includes('hr') ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
        }`}>
          {getRelativeTime(lead.date)}
        </span>
      </div>

      {/* Details Column */}
      <div className="col-span-12 md:col-span-7 flex flex-col space-y-3">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-slate-900">{lead.name}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-slate-400" />
            <a href={`tel:${sanitizedPhone}`} className="hover:text-indigo-600 transition-colors">
              {lead.phoneNumber}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-400" />
            <span className="truncate max-w-[180px]">{lead.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-slate-400" />
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${propertyTypeStyles[lead.propertyType] || 'bg-slate-100 text-slate-600'}`}>
              {lead.propertyType}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>{lead.preferredLocation}</span>
          </div>
        </div>
      </div>

      {/* Actions Column */}
      <div className="col-span-12 md:col-span-3 flex flex-row md:flex-col lg:flex-row gap-2 justify-end items-center h-full">
        <a 
          href={`tel:${sanitizedPhone}`}
          onClick={() => {
            onUpdateStatus(lead.id, LeadStatus.CALLED);
            onToggleContact(lead.id, 'phone');
          }}
          className="flex-1 lg:flex-none inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
        >
          <Phone className="w-4 h-4 mr-2" />
          Call Lead
        </a>
        <button 
          onClick={() => onToggleContact(lead.id, 'email')}
          className="flex-1 lg:flex-none inline-flex items-center justify-center px-4 py-2 border border-slate-300 bg-white text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors"
        >
          <Mail className="w-4 h-4 mr-2" />
          Email
        </button>
        <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default LeadRow;
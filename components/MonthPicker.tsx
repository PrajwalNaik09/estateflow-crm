import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthPickerProps {
  value: string; // YYYY-MM
  onChange: (month: string) => void;
  minMonth?: string; // YYYY-MM
  maxMonth?: string; // YYYY-MM
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const MonthPicker: React.FC<MonthPickerProps> = ({ value, onChange, minMonth, maxMonth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse current value or default to today
  const [currentYear, valMonth] = value ? value.split('-').map(Number) : [new Date().getFullYear(), new Date().getMonth() + 1];
  
  // Navigation State
  const [viewYear, setViewYear] = useState(currentYear);

  useEffect(() => {
    if (isOpen && value) {
      setViewYear(parseInt(value.split('-')[0]));
    }
  }, [isOpen, value]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMonthClick = (monthIndex: number) => {
    const monthStr = String(monthIndex + 1).padStart(2, '0');
    onChange(`${viewYear}-${monthStr}`);
    setIsOpen(false);
  };

  const handlePrevYear = () => setViewYear(prev => prev - 1);
  const handleNextYear = () => setViewYear(prev => prev + 1);

  const formatDisplay = (val: string) => {
    if (!val) return 'Select Month';
    const [y, m] = val.split('-');
    const date = new Date(parseInt(y), parseInt(m) - 1);
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 bg-white border border-slate-300 rounded-lg shadow-sm px-3 py-2 h-10 
          hover:bg-slate-50 transition-colors text-sm w-full sm:w-44 justify-between
          ${isOpen ? 'ring-2 ring-indigo-500 ring-offset-1 border-indigo-500' : ''}
        `}
      >
        <span className="text-slate-700 font-medium truncate">{formatDisplay(value)}</span>
        <Calendar className="w-4 h-4 text-slate-500" />
      </button>

      {/* Popup */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-white border border-slate-200 rounded-lg shadow-xl p-4 w-64 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={handlePrevYear} className="p-1 hover:bg-slate-100 rounded text-slate-600">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold text-slate-800">
              {viewYear}
            </span>
            <button onClick={handleNextYear} className="p-1 hover:bg-slate-100 rounded text-slate-600">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-3 gap-2">
            {MONTHS.map((m, idx) => {
              const currentMonthStr = `${viewYear}-${String(idx + 1).padStart(2, '0')}`;
              const isSelected = value === currentMonthStr;
              
              let isDisabled = false;
              if (minMonth && currentMonthStr < minMonth) isDisabled = true;
              if (maxMonth && currentMonthStr > maxMonth) isDisabled = true;

              return (
                <button
                  key={m}
                  onClick={() => !isDisabled && handleMonthClick(idx)}
                  disabled={isDisabled}
                  className={`
                    py-2 text-xs rounded-md transition-colors font-medium
                    ${isSelected ? 'bg-indigo-600 text-white' : ''}
                    ${!isSelected && !isDisabled ? 'hover:bg-slate-100 text-slate-700 bg-slate-50' : ''}
                    ${isDisabled ? 'text-slate-300 cursor-not-allowed bg-transparent' : ''}
                  `}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthPicker;
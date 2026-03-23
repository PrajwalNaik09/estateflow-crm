import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  minDate?: string;
  maxDate?: string;
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, minDate, maxDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse current selected date
  const selectedDate = value ? new Date(value + 'T00:00:00') : new Date();
  
  // Navigation state (viewing month/year)
  const [viewDate, setViewDate] = useState(selectedDate);

  useEffect(() => {
    // Reset view to selected date when value changes or when reopened
    if (isOpen && value) {
      setViewDate(new Date(value + 'T00:00:00'));
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

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const d = String(newDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${d}`;
    
    onChange(dateStr);
    setIsOpen(false);
  };

  // Grid Generation
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday

  const generateGrid = () => {
    const grid = [];
    // Padding for empty days at start
    for (let i = 0; i < firstDayOfMonth; i++) {
      grid.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }
    // Days
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDayDate = new Date(year, month, day);
      const currentDayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      const isSelected = value === currentDayStr;
      
      let isDisabled = false;
      if (minDate && currentDayStr < minDate) isDisabled = true;
      if (maxDate && currentDayStr > maxDate) isDisabled = true;

      grid.push(
        <button
          key={day}
          onClick={() => !isDisabled && handleDateClick(day)}
          disabled={isDisabled}
          className={`
            w-8 h-8 text-xs rounded-full flex items-center justify-center transition-colors
            ${isSelected ? 'bg-indigo-600 text-white font-bold' : ''}
            ${!isSelected && !isDisabled ? 'hover:bg-slate-100 text-slate-700' : ''}
            ${isDisabled ? 'text-slate-300 cursor-not-allowed' : ''}
            ${!isDisabled && !isSelected && (day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) ? 'text-indigo-600 font-bold bg-indigo-50' : ''} 
          `}
        >
          {day}
        </button>
      );
    }
    return grid;
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return 'Select Date';
    const d = new Date(dateStr + 'T00:00:00');
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(d);
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
        <span className="text-slate-700 font-medium truncate">{formatDateDisplay(value)}</span>
        <Calendar className="w-4 h-4 text-slate-500" />
      </button>

      {/* Popup */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-white border border-slate-200 rounded-lg shadow-xl p-4 w-64 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={handlePrevMonth} className="p-1 hover:bg-slate-100 rounded text-slate-600">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold text-slate-800">
              {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <button onClick={handleNextMonth} className="p-1 hover:bg-slate-100 rounded text-slate-600">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 mb-2 text-center">
            {DAYS.map(d => (
              <span key={d} className="text-xs font-medium text-slate-400">
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-y-1 justify-items-center">
            {generateGrid()}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
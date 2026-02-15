import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Lightbulb } from 'lucide-react';

export default function DateSelector({ selectedDate, onDateChange, onShowHowToUse }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-t-4 border-red-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
            Game Date
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={onDateChange}
            dateFormat="MMMM d, yyyy"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-700 focus:ring-2 focus:ring-red-700/20 text-gray-700 font-medium shadow-sm"
          />
        </div>
        
    
      </div>
    </div>
  );
}

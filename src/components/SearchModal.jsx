import { useState } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchModal({ show, onClose, rows }) {
  const [searchTime, setSearchTime] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState('');

  const parseTimeToSeconds = (timeStr) => {
    if (!timeStr) return null;
    
    const parts = timeStr.split(':');
    if (parts.length !== 3) return null;
    
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    const seconds = parseInt(parts[2]);
    
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return null;
    if (minutes > 59 || seconds > 59) return null;
    
    return hours * 3600 + minutes * 60 + seconds;
  };

  const formatTimeFromSeconds = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const formatInputTime = (value) => {
    if (!value || value.trim() === '') return null;
    
    // Remove any spaces
    const cleanValue = value.trim();
    
    // Split by colon
    const parts = cleanValue.split(':');
    
    let formattedTime = '';
    
    if (parts.length === 1) {
      // Only seconds (e.g., "55" -> "00:00:55")
      const seconds = parts[0].padStart(2, '0');
      if (parseInt(seconds) > 59) return null;
      formattedTime = `00:00:${seconds}`;
    } else if (parts.length === 2) {
      // Minutes and seconds (e.g., "12:45" -> "00:12:45")
      const minutes = parts[0].padStart(2, '0');
      const seconds = parts[1].padStart(2, '0');
      if (parseInt(minutes) > 59 || parseInt(seconds) > 59) return null;
      formattedTime = `00:${minutes}:${seconds}`;
    } else if (parts.length === 3) {
      // Already HH:MM:SS format
      const hours = parts[0].padStart(2, '0');
      const minutes = parts[1].padStart(2, '0');
      const seconds = parts[2].padStart(2, '0');
      if (parseInt(minutes) > 59 || parseInt(seconds) > 59) return null;
      formattedTime = `${hours}:${minutes}:${seconds}`;
    } else {
      return null;
    }
    
    return formattedTime;
  };

  const handleSearch = () => {
    setError('');
    setSearchResults(null);

    // Format the input time
    const formattedTime = formatInputTime(searchTime);
    if (!formattedTime) {
      setError('Invalid time format. Please use HH:MM:SS, MM:SS, or SS format.');
      return;
    }

    const searchSeconds = parseTimeToSeconds(formattedTime);
    if (searchSeconds === null) {
      setError('Invalid time value.');
      return;
    }

    // Search within ±3 seconds
    const matches = [];
    rows.forEach((row) => {
      if (!row.time) return;
      
      const rowSeconds = parseTimeToSeconds(row.time);
      if (rowSeconds === null) return;
      
      const difference = Math.abs(rowSeconds - searchSeconds);
      if (difference <= 6) {
        matches.push({
          placement: row.placement,
          camera: row.camera,
          time: row.time,
          side: row.side,
          difference: difference
        });
      }
    });

    setSearchResults(matches);
  };

  const handleTimeChange = (e) => {
    setSearchTime(e.target.value);
    setError('');
    setSearchResults(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-gray-200 p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-700 flex items-center gap-2">
              <Search className="text-red-700" size={28} />
              Search Table
            </h2>
            <p className="text-sm text-gray-500 mt-1">Find entries within ±6 seconds</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time (HH:MM:SS, MM:SS, or SS)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTime}
                onChange={handleTimeChange}
                onKeyPress={handleKeyPress}
                placeholder="55 or 12:45 or 01:12:45"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
              >
                <Search size={18} />
                Search
              </button>
            </div>
            {error && (
              <p className="text-red-600 text-sm mt-2">{error}</p>
            )}
          </div>

          {searchResults !== null && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-3">Search Results:</h3>
              {searchResults.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-gray-600">No entries found within ±6 seconds of {formatInputTime(searchTime) || searchTime}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {searchResults.map((result, index) => (
                    <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-800">Row #{result.placement}</p>
                          <div className="text-sm text-gray-600 space-y-1 mt-1">
                            <p><span className="font-medium">Camera:</span> {result.camera}</p>
                            <p><span className="font-medium">Time:</span> {result.time}</p>
                            <p><span className="font-medium">Side:</span> {result.side === 'left' ? 'Left' : 'Right'}</p>
                          </div>
                        </div>
                        <div className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                          {result.difference === 0 ? 'Exact' : `±${result.difference}s`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

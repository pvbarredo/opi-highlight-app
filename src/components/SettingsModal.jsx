import { useState, useEffect } from 'react';
import { Settings, X } from 'lucide-react';

export default function SettingsModal({ show, onClose, settings, onSave }) {
  const [cam1Time, setCam1Time] = useState('');
  const [cam2Time, setCam2Time] = useState('');
  const [timeDifference, setTimeDifference] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  const [showCategory, setShowCategory] = useState(false);

  useEffect(() => {
    if (show && settings) {
      setCam1Time(settings.cam1Time || '');
      setCam2Time(settings.cam2Time || '');
      setTimeDifference(settings.difference !== undefined ? settings.difference : null);
      setShowDescription(settings.showDescription || false);
      setShowCategory(settings.showCategory || false);
    }
  }, [show, settings]);

  const parseTimeToSeconds = (timeStr) => {
    if (!timeStr || timeStr.trim() === '') return null;
    
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
    const absSeconds = Math.abs(totalSeconds);
    const hours = Math.floor(absSeconds / 3600);
    const minutes = Math.floor((absSeconds % 3600) / 60);
    const seconds = absSeconds % 60;
    
    const sign = totalSeconds < 0 ? '-' : '+';
    return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
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

  const validateTimeFormat = (value) => {
    const timeRegex = /^([0-9]{1,2}):([0-5][0-9]):([0-5][0-9])$/;
    return timeRegex.test(value);
  };

  const handleCam1Change = (e) => {
    setCam1Time(e.target.value);
  };

  const handleCam2Change = (e) => {
    setCam2Time(e.target.value);
  };

  const handleCam1Blur = () => {
    if (cam1Time) {
      const formatted = formatInputTime(cam1Time);
      if (formatted) {
        setCam1Time(formatted);
        calculateDifference(formatted, cam2Time);
      }
    }
  };

  const handleCam2Blur = () => {
    if (cam2Time) {
      const formatted = formatInputTime(cam2Time);
      if (formatted) {
        setCam2Time(formatted);
        calculateDifference(cam1Time, formatted);
      }
    }
  };

  const calculateDifference = (cam1, cam2) => {
    if (!cam1 || !cam2) {
      setTimeDifference(null);
      return;
    }

    if (!validateTimeFormat(cam1) || !validateTimeFormat(cam2)) {
      setTimeDifference(null);
      return;
    }

    const cam1Seconds = parseTimeToSeconds(cam1);
    const cam2Seconds = parseTimeToSeconds(cam2);

    if (cam1Seconds === null || cam2Seconds === null) {
      setTimeDifference(null);
      return;
    }

    const difference = cam2Seconds - cam1Seconds;
    setTimeDifference(difference);
  };

  const handleSave = () => {
    const settingsData = {
      cam1Time: cam1Time || '',
      cam2Time: cam2Time || '',
      difference: timeDifference,
      showDescription,
      showCategory
    };
    onSave(settingsData);
    onClose();
  };

  const handleReset = () => {
    setCam1Time('');
    setCam2Time('');
    setTimeDifference(null);
    setShowDescription(false);
    setShowCategory(false);
    onSave({ 
      cam1Time: '', 
      cam2Time: '', 
      difference: null,
      showDescription: false,
      showCategory: false
    });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-gray-200 p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-700 flex items-center gap-2">
              <Settings className="text-red-700" size={28} />
              Settings
            </h2>
            <p className="text-sm text-gray-500 mt-1">Configure application settings</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-5">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Set Camera Synchronization</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cam1 Time (Numbers only - HH:MM:SS)
                </label>
                <input
                  type="text"
                  value={cam1Time}
                  onChange={handleCam1Change}
                  onBlur={handleCam1Blur}
                  placeholder="55 or 12:45 or 01:12:45"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cam2 Time (Numbers only - HH:MM:SS)
                </label>
                <input
                  type="text"
                  value={cam2Time}
                  onChange={handleCam2Change}
                  onBlur={handleCam2Blur}
                  placeholder="55 or 12:45 or 01:12:45"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {timeDifference !== null && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Time Discrepancy:</p>
                  <p className="text-lg font-bold text-blue-700">
                    {formatTimeFromSeconds(timeDifference)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {timeDifference >= 0 ? 'Cam2 is ahead of Cam1' : 'Cam1 is ahead of Cam2'}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-5">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Show Additional Columns</h3>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showDescription}
                  onChange={(e) => setShowDescription(e.target.checked)}
                  className="w-5 h-5 text-red-700 focus:ring-red-700 accent-red-700 cursor-pointer rounded"
                />
                <span className="text-sm font-medium text-gray-700">Show Description</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCategory}
                  onChange={(e) => setShowCategory(e.target.checked)}
                  className="w-5 h-5 text-red-700 focus:ring-red-700 accent-red-700 cursor-pointer rounded"
                />
                <span className="text-sm font-medium text-gray-700">Show Category</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

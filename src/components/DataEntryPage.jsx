import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Lightbulb, Search, Settings } from 'lucide-react';
import SortableTableRow from './SortableTableRow';
import SortableCard from './SortableCard';
import HowToUseModal from './HowToUseModal';
import AlertModal from './AlertModal';
import DateSelector from './DateSelector';
import ActionButtons from './ActionButtons';
import SearchModal from './SearchModal';
import SettingsModal from './SettingsModal';
import Footer from './Footer';

export default function DataEntryPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [rows, setRows] = useState([
    { id: '1', camera: '', time: '', side: 'left', placement: 1 },
  ]);
  const [showHowToUse, setShowHowToUse] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [language, setLanguage] = useState('english'); // 'english' or 'filipino'
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [cameraSync, setCameraSync] = useState(() => {
    // Load from localStorage on initial render
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return { 
          cam1Time: '', 
          cam2Time: '', 
          difference: null,
          showDescription: false,
          showCategory: false
        };
      }
    }
    return { 
      cam1Time: '', 
      cam2Time: '', 
      difference: null,
      showDescription: false,
      showCategory: false
    };
  });
  const [alertModal, setAlertModal] = useState({
    show: false,
    title: '',
    message: '',
    type: 'info', // 'info', 'success', 'confirm'
    onConfirm: null,
  });

  // Persist settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(cameraSync));
  }, [cameraSync]);

  // Handle window resize to toggle between mobile and desktop views
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setRows((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const reorderedItems = arrayMove(items, oldIndex, newIndex);
        
        // Update placement numbers after reordering
        return reorderedItems.map((item, index) => ({
          ...item,
          placement: index + 1
        }));
      });
    }
  };

  const addRow = () => {
    // Get the last row to check if we should copy values
    const lastRow = rows[rows.length - 1];
    const shouldCopyValues = lastRow && lastRow.camera && lastRow.time;
    
    const newRow = {
      id: Date.now().toString(),
      camera: shouldCopyValues ? lastRow.camera : '',
      time: shouldCopyValues ? lastRow.time : '',
      side: shouldCopyValues ? lastRow.side : 'left',
      placement: rows.length + 1,
      isNew: true, // Always mark new rows with yellow background
    };
    
    // If we copied a camera value that contains cam1 or cam2, set lastValidCamera
    if (shouldCopyValues) {
      const cameraLower = lastRow.camera.toLowerCase();
      const isCam1 = cameraLower === 'cam1' || !!cameraLower.match(/\bcam1\b/i);
      const isCam2 = cameraLower === 'cam2' || !!cameraLower.match(/\bcam2\b/i);
      if (isCam1 || isCam2) {
        newRow.lastValidCamera = lastRow.camera;
      }
    }
    
    setRows([...rows, newRow]);
  };

  const deleteRow = (id) => {
    const filtered = rows.filter((row) => row.id !== id);
    // Recalculate placement numbers
    const updated = filtered.map((row, index) => ({
      ...row,
      placement: index + 1
    }));
    setRows(updated);
  };

  // Helper function to parse time string to seconds
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

  // Helper function to convert seconds back to time string
  const secondsToTimeString = (totalSeconds) => {
    if (totalSeconds < 0) totalSeconds = 0; // Prevent negative times
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleSaveCameraSync = (syncData) => {
    setCameraSync(syncData);
    // Save to localStorage
    localStorage.setItem('appSettings', JSON.stringify(syncData));
  };

  const updateRow = (id, field, value) => {
    setRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id === id) {
          const updatedRow = { ...row, [field]: value };
          
          // Remove isNew flag when user types in camera or time field
          if (updatedRow.isNew && (field === 'camera' || field === 'time')) {
            delete updatedRow.isNew;
          }
          
          // Auto-set side based on camera value and adjust time based on camera sync
          if (field === 'camera') {
            const cameraValue = (value || '').toLowerCase();
            
            // Use lastValidCamera as the old value, or current camera if no valid camera was set before
            const oldCameraValue = (row.lastValidCamera || '').toLowerCase();
            
            console.log('=== CAMERA FIELD CHANGE DEBUG ===');
            console.log('Old Camera (lastValidCamera):', row.lastValidCamera);
            console.log('New Camera:', value);
            console.log('Current Time:', row.time);
            console.log('Time Difference Setting:', cameraSync?.difference);
            
            // Set side
            if (cameraValue.includes('cam1')) {
              updatedRow.side = 'left';
            } else if (cameraValue.includes('cam2')) {
              updatedRow.side = 'right';
            }
            
            // Adjust time if camera changed and we have both time and time difference
            if (row.time && cameraSync && cameraSync.difference !== null && cameraSync.difference !== undefined) {
              const timeInSeconds = parseTimeToSeconds(row.time);
              
              console.log('Time in Seconds:', timeInSeconds);
              
              if (timeInSeconds !== null) {
                // Determine old and new camera types (case-insensitive)
                const wasCam1 = oldCameraValue === 'cam1' || (oldCameraValue.length > 0 && oldCameraValue.match(/\bcam1\b/i) !== null);
                const wasCam2 = oldCameraValue === 'cam2' || (oldCameraValue.length > 0 && oldCameraValue.match(/\bcam2\b/i) !== null);
                const isCam1 = cameraValue === 'cam1' || (cameraValue.length > 0 && cameraValue.match(/\bcam1\b/i) !== null);
                const isCam2 = cameraValue === 'cam2' || (cameraValue.length > 0 && cameraValue.match(/\bcam2\b/i) !== null);
                
                console.log('Camera Type Flags:', {
                  wasCam1,
                  wasCam2,
                  isCam1,
                  isCam2
                });
                
                // If switching from cam1 to cam2, add the difference
                if (wasCam1 && isCam2 && !wasCam2 && !isCam1) {
                  const newTimeInSeconds = timeInSeconds + cameraSync.difference;
                  const oldTime = row.time;
                  const newTime = secondsToTimeString(newTimeInSeconds);
                  updatedRow.time = newTime;
                  
                  console.log('✅ Switched cam1 → cam2');
                  console.log('New Time (seconds):', newTimeInSeconds);
                  console.log('New Time (formatted):', updatedRow.time);
                  
                  // Show alert about the camera switch and time adjustment
                  setAlertModal({
                    show: true,
                    title: '⏱️ Time Adjusted: Cam1 → Cam2',
                    message: `Camera switched from Cam1 to Cam2.\n\nTime automatically adjusted:\n• Old time: ${oldTime}\n• New time: ${newTime}\n• Difference: +${cameraSync.difference} seconds`,
                    type: 'info',
                    onConfirm: null,
                  });
                }
                // If switching from cam2 to cam1, subtract the difference
                else if (wasCam2 && isCam1 && !wasCam1 && !isCam2) {
                  const newTimeInSeconds = timeInSeconds - cameraSync.difference;
                  const oldTime = row.time;
                  const newTime = secondsToTimeString(newTimeInSeconds);
                  updatedRow.time = newTime;
                  
                  console.log('✅ Switched cam2 → cam1');
                  console.log('New Time (seconds):', newTimeInSeconds);
                  console.log('New Time (formatted):', updatedRow.time);
                  
                  // Show alert about the camera switch and time adjustment
                  setAlertModal({
                    show: true,
                    title: '⏱️ Time Adjusted: Cam2 → Cam1',
                    message: `Camera switched from Cam2 to Cam1.\n\nTime automatically adjusted:\n• Old time: ${oldTime}\n• New time: ${newTime}\n• Difference: -${cameraSync.difference} seconds`,
                    type: 'info',
                    onConfirm: null,
                  });
                } else {
                  console.log('❌ No time conversion - conditions not met');
                  console.log('Conversion requires switching between cam1 and cam2');
                  console.log('Make sure you had cam1 or cam2 set before changing to the other');
                }
              } else {
                console.log('❌ Could not parse time to seconds');
              }
            } else {
              console.log('❌ Time conversion skipped:', {
                hasTime: !!row.time,
                hasCameraSync: !!cameraSync,
                hasDifference: cameraSync?.difference !== null && cameraSync?.difference !== undefined
              });
            }
            
            // Update lastValidCamera when new value is cam1 or cam2
            const isCam1 = cameraValue === 'cam1' || (cameraValue && !!cameraValue.match(/\bcam1\b/i));
            const isCam2 = cameraValue === 'cam2' || (cameraValue && !!cameraValue.match(/\bcam2\b/i));
            if (isCam1 || isCam2) {
              updatedRow.lastValidCamera = value;
              console.log('📌 Updated lastValidCamera to:', value);
            }
            
            console.log('=== END DEBUG ===\n');
          }
          
          return updatedRow;
        }
        return row;
      })
    );
  };

  const handleTimeBlur = (id, value) => {
    if (!value || value.trim() === '') return;
    
    // Remove any non-digit and non-colon characters
    const cleanValue = value.replace(/[^\d:]/g, '');
    
    // Split by colon
    const parts = cleanValue.split(':').filter(part => part !== '');
    
    if (parts.length === 0) {
      setAlertModal({
        show: true,
        title: 'Invalid Time Format',
        message: 'Please enter time in HH:MM:SS format (numbers only)',
        type: 'info',
        onConfirm: null,
      });
      return;
    }
    
    let hours = '00', minutes = '00', seconds = '00';
    
    if (parts.length === 1) {
      // Only one number - treat as seconds
      seconds = parts[0].padStart(2, '0');
    } else if (parts.length === 2) {
      // Two parts - treat as MM:SS
      minutes = parts[0].padStart(2, '0');
      seconds = parts[1].padStart(2, '0');
    } else if (parts.length >= 3) {
      // Three or more parts - treat as HH:MM:SS
      hours = parts[0].padStart(2, '0');
      minutes = parts[1].padStart(2, '0');
      seconds = parts[2].padStart(2, '0');
    }
    
    // Validate ranges
    const h = parseInt(hours);
    const m = parseInt(minutes);
    const s = parseInt(seconds);
    
    if (isNaN(h) || isNaN(m) || isNaN(s) || m > 59 || s > 59) {
      setAlertModal({
        show: true,
        title: 'Invalid Time Format',
        message: 'Invalid time values. Minutes and seconds must be 0-59.',
        type: 'info',
        onConfirm: null,
      });
      return;
    }
    
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    updateRow(id, 'time', formattedTime);
  };

  const validateCameraSides = () => {
    const mismatches = [];
    
    rows.forEach((row) => {
      const cameraLower = (row.camera || '').toLowerCase();
      
      if (cameraLower.includes('cam1') && row.side !== 'left') {
        mismatches.push({ placement: row.placement, camera: row.camera, expected: 'Left', actual: row.side === 'left' ? 'Left' : 'Right' });
      } else if (cameraLower.includes('cam2') && row.side !== 'right') {
        mismatches.push({ placement: row.placement, camera: row.camera, expected: 'Right', actual: row.side === 'left' ? 'Left' : 'Right' });
      }
    });
    
    return mismatches;
  };

  const performSaveCSV = () => {
    // CSV export logic with date
    const dateRow = ['Date', selectedDate.toISOString().split('T')[0]];
    const headers = ['Placement', 'Camera', 'Time', 'Side'];
    const csvData = rows.map(row => [row.placement, row.camera, row.time, row.side]);
    const csvContent = [dateRow.join(','), headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `data-${selectedDate.toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveCSV = () => {
    // Validate camera sides before saving
    const mismatches = validateCameraSides();
    
    if (mismatches.length > 0) {
      const mismatchDetails = mismatches.map(m => 
        `Row ${m.placement}: ${m.camera} (Expected: ${m.expected}, Current: ${m.actual})`
      ).join('\n');
      
      setAlertModal({
        show: true,
        title: '⚠️ Camera Side Warning',
        message: `Please double-check the side settings for better video quality:\n\n• Cam1 clips should use Left side\n• Cam2 clips should use Right side\n\nMismatched entries:\n${mismatchDetails}\n\nDo you want to proceed anyway?`,
        type: 'warning',
        onConfirm: () => {
          setAlertModal({ show: false, title: '', message: '', type: 'info', onConfirm: null });
          performSaveCSV();
        },
      });
      return;
    }
    
    performSaveCSV();
  };

  const handleEmailCSV = async () => {
    // Generate CSV content
    const dateRow = ['Date', selectedDate.toISOString().split('T')[0]];
    const headers = ['Placement', 'Camera', 'Time', 'Side'];
    const csvData = rows.map(row => [row.placement, row.camera, row.time, row.side]);
    const csvContent = [dateRow.join(','), headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
    
    // Create mailto link with CSV data in body
    const emailSubject = `OPI Highlight Extract - ${selectedDate.toLocaleDateString('en-US')}`;
    const emailBody = `Hello,\n\nPlease find the highlight extraction data for ${selectedDate.toLocaleDateString('en-US')}:\n\nTotal entries: ${rows.length}\n\n--- CSV DATA ---\n${csvContent}\n--- END CSV DATA ---\n\nBest regards,\nOPI Basketball Community`;
    
    const mailtoLink = `mailto:pvbarredo@gmail.com,peter.emmanuel.barredo@oocl.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Open default email client
    window.location.href = mailtoLink;
    
    // Show success message
    setAlertModal({
      show: true,
      title: 'Email Client Opened',
      message: 'Your default email client has been opened with the CSV data.\n\nIf it didn\'t open, please check your browser settings.',
      type: 'info',
      onConfirm: null,
    });
  };

  const handleImportCSV = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target.result;
          const lines = text.split('\n');
          const importedRows = [];
          
          // Parse date from first line
          const dateLine = lines[0].trim();
          if (dateLine.startsWith('Date,')) {
            const dateStr = dateLine.split(',')[1];
            if (dateStr) {
              setSelectedDate(new Date(dateStr));
            }
          }
          
          // Skip date row and header row, parse data starting from line 2
          for (let i = 2; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
              const [placement, camera, time, side] = line.split(',');
              importedRows.push({
                id: Date.now().toString() + i,
                placement: parseInt(placement) || (i - 1),
                camera: camera || '',
                time: time || '',
                side: side || 'left'
              });
            }
          }
          
          if (importedRows.length > 0) {
            setRows(importedRows);
            setAlertModal({
              show: true,
              title: 'Import Successful',
              message: `Successfully imported ${importedRows.length} rows`,
              type: 'success',
              onConfirm: null,
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const resetTable = () => {
    setAlertModal({
      show: true,
      title: 'Reset Table',
      message: 'Are you sure you want to reset all rows? This action cannot be undone.',
      type: 'confirm',
      onConfirm: () => {
        setRows([{ id: '1', camera: '', time: '', side: 'left', placement: 1 }]);
        setAlertModal({ show: false, title: '', message: '', type: 'info', onConfirm: null });
      },
    });
  };

  const performSubmit = () => {
    // Submit logic - Save CSV first
    performSaveCSV();
    
    // Then open email
    const submitData = {
      date: selectedDate.toISOString(),
      formattedDate: selectedDate.toLocaleDateString('en-US'),
      entries: rows,
      totalEntries: rows.length
    };
    
    console.log('=== SUBMIT DATA ===');
    console.log(JSON.stringify(submitData, null, 2));
    console.log('===================');
    
    // Generate CSV content for email
    const dateRow = ['Date', selectedDate.toISOString().split('T')[0]];
    const headers = ['Placement', 'Camera', 'Time', 'Side'];
    const csvData = rows.map(row => [row.placement, row.camera, row.time, row.side]);
    const csvContent = [dateRow.join(','), headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
    
    // Create mailto link with CSV data in body
    const emailSubject = `OPI Highlight Extract - ${selectedDate.toLocaleDateString('en-US')}`;
    const emailBody = `Hello,\n\nPlease find the highlight extraction data for ${selectedDate.toLocaleDateString('en-US')}:\n\nTotal entries: ${rows.length}\n\n--- CSV DATA ---\n${csvContent}\n--- END CSV DATA ---\n\nBest regards,\nOPI Basketball Community`;
    
    const mailtoLink = `mailto:pvbarredo@gmail.com,peter.emmanuel.barredo@oocl.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Open default email client
    window.location.href = mailtoLink;
    
    setAlertModal({
      show: true,
      title: 'Data Submitted Successfully',
      message: `Total entries: ${rows.length}\n\nCSV file downloaded and email client opened.\n\n⚠️ IMPORTANT FOR OOCL OUTLOOK USERS:\nPlease change email sensitivity from "Restricted" to "Public" before sending!\n(Click the sensitivity dropdown and select "Public")`,
      type: 'success',
      onConfirm: null,
    });
  };

  const handleSubmit = () => {
    // Validate camera sides before submitting
    const mismatches = validateCameraSides();
    
    if (mismatches.length > 0) {
      const mismatchDetails = mismatches.map(m => 
        `Row ${m.placement}: ${m.camera} (Expected: ${m.expected}, Current: ${m.actual})`
      ).join('\n');
      
      setAlertModal({
        show: true,
        title: '⚠️ Camera Side Warning',
        message: `Please double-check the side settings for better video quality:\n\n• Cam1 clips should use Left side\n• Cam2 clips should use Right side\n\nMismatched entries:\n${mismatchDetails}\n\nDo you want to proceed anyway?`,
        type: 'warning',
        onConfirm: () => {
          setAlertModal({ show: false, title: '', message: '', type: 'info', onConfirm: null });
          performSubmit();
        },
      });
      return;
    }
    
    performSubmit();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Title Bar */}
        <div className="bg-gradient-to-r from-red-700 to-red-600 rounded-lg shadow-lg p-6 mb-6 text-white">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">OPI Basketball Community</h1>
            <p className="text-red-100 text-lg md:text-xl font-medium">Highlight Extractor</p>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setShowHowToUse(true)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors backdrop-blur-sm border border-white/20"
            >
              <Lightbulb size={20} />
              <span className="text-sm font-medium">How to Use</span>
            </button>
          </div>
        </div>

        {/* How to Use Modal */}
        <HowToUseModal
          show={showHowToUse}
          onClose={() => setShowHowToUse(false)}
          language={language}
          onLanguageChange={setLanguage}
        />

        {/* Alert Modal */}
        <AlertModal
          show={alertModal.show}
          title={alertModal.title}
          message={alertModal.message}
          type={alertModal.type}
          onConfirm={alertModal.onConfirm}
          onClose={() => setAlertModal({ show: false, title: '', message: '', type: 'info', onConfirm: null })}
        />

        {/* Search Modal */}
        <SearchModal
          show={showSearch}
          onClose={() => setShowSearch(false)}
          rows={rows}
        />

        {/* Settings Modal */}
        <SettingsModal
          show={showSettings}
          onClose={() => setShowSettings(false)}
          settings={cameraSync}
          onSave={handleSaveCameraSync}
        />

        {/* Date Picker Section */}
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onShowHowToUse={() => setShowHowToUse(true)}
        />

        {/* Search Button Row */}
        <div className="mb-4 flex justify-end gap-3">
         
          <button
            onClick={() => setShowSearch(true)}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm flex items-center gap-2"
          >
            <Search size={18} />
            Search Table
          </button>
           <button
            onClick={() => setShowSettings(true)}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium shadow-sm flex items-center gap-2"
          >
            <Settings size={18} />
            
          </button>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4 border-t-4 border-red-700">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={rows.map((row) => row.id)}
              strategy={verticalListSortingStrategy}
            >
              {!isMobile ? (
                /* Desktop Table */
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-700 border-b-2 border-red-700">
                        <th className="px-3 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider w-10">
                          #
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider w-10">
                          
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                          Camera
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                          Time
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                          Side
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {rows.map((row) => (
                        <SortableTableRow
                          key={row.id}
                          row={row}
                          onUpdate={updateRow}
                          onDelete={deleteRow}
                          onTimeBlur={handleTimeBlur}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* Mobile Cards */
                <div>
                  {rows.map((row) => (
                    <SortableCard
                      key={row.id}
                      row={row}
                      onUpdate={updateRow}
                      onDelete={deleteRow}
                      onTimeBlur={handleTimeBlur}
                    />
                  ))}
                </div>
              )}
            </SortableContext>
          </DndContext>

          {/* Add New Camera Row Button */}
          <button
            onClick={addRow}
            className="w-full mt-4 py-3 text-sm text-gray-600 hover:text-red-700 border-2 border-dashed border-gray-300 rounded hover:border-red-700 transition-colors font-medium"
          >
            + Add New Camera Row
          </button>
        </div>

        {/* Action Buttons */}
        <ActionButtons
          onSaveCSV={handleSaveCSV}
          onImportCSV={handleImportCSV}
          onSubmit={handleSubmit}
        />

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

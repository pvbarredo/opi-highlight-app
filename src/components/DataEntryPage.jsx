import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2, Lightbulb, X } from 'lucide-react';

// Sortable Table Row Component (Desktop)
function SortableTableRow({ row, onUpdate, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className="border-b border-gray-200 bg-white hover:bg-gray-50"
    >
      <td className="px-3 py-4 text-center text-sm font-semibold text-gray-600">
        {row.placement}
      </td>
      <td className="px-3 py-4 w-10">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500"
        >
          <GripVertical size={20} />
        </button>
      </td>
      <td className="px-3 py-4">
        <input
          type="text"
          value={row.camera}
          onChange={(e) => onUpdate(row.id, 'camera', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 text-sm"
          placeholder="Cam ID"
        />
      </td>
      <td className="px-3 py-4">
        <input
          type="text"
          value={row.time}
          onChange={(e) => onUpdate(row.id, 'time', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 text-sm"
          placeholder="00.00"
        />
      </td>
      <td className="px-3 py-4">
        <div className="flex gap-4 items-center">
          <label htmlFor={`side-left-${row.id}`} className="flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              id={`side-left-${row.id}`}
              name={`side-${row.id}`}
              value="left"
              checked={row.side === 'left'}
              onChange={() => onUpdate(row.id, 'side', 'left')}
              className="w-4 h-4 text-red-700 focus:ring-red-700 accent-red-700 cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-700">L</span>
          </label>
          <label htmlFor={`side-right-${row.id}`} className="flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              id={`side-right-${row.id}`}
              name={`side-${row.id}`}
              value="right"
              checked={row.side === 'right'}
              onChange={() => onUpdate(row.id, 'side', 'right')}
              className="w-4 h-4 text-red-700 focus:ring-red-700 accent-red-700 cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-700">R</span>
          </label>
          <button
            onClick={() => onDelete(row.id)}
            className="ml-4 text-red-700 hover:text-red-900 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}

// Sortable Card Component (Mobile)
function SortableCard({ row, onUpdate, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-gray-200 rounded p-4 mb-3"
    >
      <div className="flex items-start gap-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 mt-1"
        >
          <GripVertical size={20} />
        </button>
        
        <div className="flex-1 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">
              Camera
            </label>
            <input
              type="text"
              value={row.camera}
              onChange={(e) => onUpdate(row.id, 'camera', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 text-sm"
              placeholder="Cam ID"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">
              Time
            </label>
            <input
              type="text"
              value={row.time}
              onChange={(e) => onUpdate(row.id, 'time', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 text-sm"
              placeholder="00.00"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">
              Side
            </label>
            <div className="flex gap-6 items-center justify-start">
              <label htmlFor={`side-left-mobile-${row.id}`} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  id={`side-left-mobile-${row.id}`}
                  name={`side-${row.id}`}
                  value="left"
                  checked={row.side === 'left'}
                  onChange={() => onUpdate(row.id, 'side', 'left')}
                  className="w-4 h-4 text-red-700 focus:ring-red-700 accent-red-700 cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-700">L</span>
              </label>
              <label htmlFor={`side-right-mobile-${row.id}`} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  id={`side-right-mobile-${row.id}`}
                  name={`side-${row.id}`}
                  value="right"
                  checked={row.side === 'right'}
                  onChange={() => onUpdate(row.id, 'side', 'right')}
                  className="w-4 h-4 text-red-700 focus:ring-red-700 accent-red-700 cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-700">R</span>
              </label>
            </div>
          </div>
        </div>

        <button
          onClick={() => onDelete(row.id)}
          className="text-red-700 hover:text-red-900 transition-colors mt-1"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

// Main Component
export default function DataEntryPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [rows, setRows] = useState([
    { id: '1', camera: '', time: '', side: 'left', placement: 1 },
  ]);
  const [showHowToUse, setShowHowToUse] = useState(false);
  const [alertModal, setAlertModal] = useState({
    show: false,
    title: '',
    message: '',
    type: 'info', // 'info', 'success', 'confirm'
    onConfirm: null,
  });

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
    const newRow = {
      id: Date.now().toString(),
      camera: '',
      time: '',
      side: 'left',
      placement: rows.length + 1,
    };
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

  const updateRow = (id, field, value) => {
    setRows((prevRows) => {
      const updatedRows = prevRows.map((row) => 
        row.id === id ? { ...row, [field]: value } : row
      );
      
      console.log('=== UPDATE ROW ===');
      console.log('Row ID:', id);
      console.log('Field:', field);
      console.log('New Value:', value);
      console.log('Updated Row:', updatedRows.find(row => row.id === id));
      console.log('All Rows:', JSON.stringify(updatedRows, null, 2));
      console.log('==================');
      
      return updatedRows;
    });
  };

  const handleSaveCSV = () => {
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

  const handleEmailCSV = async () => {
    // Generate CSV content
    const dateRow = ['Date', selectedDate.toISOString().split('T')[0]];
    const headers = ['Placement', 'Camera', 'Time', 'Side'];
    const csvData = rows.map(row => [row.placement, row.camera, row.time, row.side]);
    const csvContent = [dateRow.join(','), headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
    
    // Create mailto link with CSV data in body
    const emailSubject = `OPI Highlight Extract - ${selectedDate.toLocaleDateString('en-US')}`;
    const emailBody = `Hello,\n\nPlease find the highlight extraction data for ${selectedDate.toLocaleDateString('en-US')}:\n\nTotal entries: ${rows.length}\n\n--- CSV DATA ---\n${csvContent}\n--- END CSV DATA ---\n\nBest regards,\nOPI Basketball Community`;
    
    const mailtoLink = `mailto:pvbarredo@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
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

  const handleSubmit = () => {
    // Submit logic
    const submitData = {
      date: selectedDate.toISOString(),
      formattedDate: selectedDate.toLocaleDateString('en-US'),
      entries: rows,
      totalEntries: rows.length
    };
    
    console.log('=== SUBMIT DATA ===');
    console.log(JSON.stringify(submitData, null, 2));
    console.log('===================');
    
    setAlertModal({
      show: true,
      title: 'Data Submitted Successfully',
      message: `Total entries: ${rows.length}\n\nCheck console for JSON output.`,
      type: 'success',
      onConfirm: null,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Title Bar */}
        <div className="bg-gradient-to-r from-red-700 to-red-600 rounded-lg shadow-lg p-6 mb-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">OPI Basketball Community</h1>
              <p className="text-red-100 text-lg md:text-xl font-medium">Highlight Extractor</p>
            </div>
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
        {showHowToUse && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowHowToUse(false)}>
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
                <h2 className="text-2xl font-bold text-gray-700 flex items-center gap-2">
                  <Lightbulb className="text-red-700" size={28} />
                  How to Use
                </h2>
                <button
                  onClick={() => setShowHowToUse(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-5">
                <div>
                  <p className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <span className="text-xl">📅</span> Select Game Date
                  </p>
                  <p className="text-sm text-gray-600">Choose the date of the game you want to extract highlights from.</p>
                </div>

                <div>
                  <p className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <span className="text-xl">📹</span> Camera Values
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2 text-sm text-gray-600">
                    <li><strong>Cam 1:</strong> Entrance camera</li>
                    <li><strong>Cam 2:</strong> Opposite side of Cam 1</li>
                    <li>For videos with multiple parts, use format: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-red-700 font-mono">"Cam 2 Part 1"</code></li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <span className="text-xl">⏱️</span> Timestamp Format
                  </p>
                  <p className="text-sm text-gray-600 mb-2">Enter the exact time when the play happens in format: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-red-700 font-mono">HH:MM:SS</code></p>
                  <p className="text-xs italic text-gray-500 mb-3">Example: "01:53:22" means 1 hour, 53 minutes, 22 seconds</p>
                  
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <p className="font-semibold text-gray-700 mb-3 text-sm flex items-center gap-2">
                      <span className="text-lg">⏰</span> Timing Rules:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-red-700 font-bold">•</span>
                        <span><strong>Shoot/Score:</strong> When the ball goes through the net</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-700 font-bold">•</span>
                        <span><strong>Pass:</strong> When the receiver catches the ball</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-700 font-bold">•</span>
                        <span><strong>Rebound:</strong> When the rebounder secures the ball</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-700 font-bold">•</span>
                        <span><strong>Steal:</strong> When the player gains possession</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-700 font-bold">•</span>
                        <span><strong>Block:</strong> When contact is made with the ball</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <span className="text-xl">◀️ ▶️</span> Camera Side
                  </p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Left (L):</strong> Closer side to the camera</p>
                    <p><strong>Right (R):</strong> Farther side from the camera</p>
                    <p className="text-xs italic text-gray-500 mt-2 flex items-center gap-1">
                      <span className="text-base">💡</span> Tip: Right side might offer a better angle for certain highlights!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alert Modal */}
        {alertModal.show && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-700 mb-3">
                  {alertModal.title}
                </h3>
                <p className="text-gray-600 whitespace-pre-line mb-6">
                  {alertModal.message}
                </p>
                <div className="flex gap-3 justify-end">
                  {alertModal.type === 'confirm' ? (
                    <>
                      <button
                        onClick={() => setAlertModal({ show: false, title: '', message: '', type: 'info', onConfirm: null })}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={alertModal.onConfirm}
                        className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors font-medium"
                      >
                        Confirm
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setAlertModal({ show: false, title: '', message: '', type: 'info', onConfirm: null })}
                      className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors font-medium"
                    >
                      OK
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Date Picker Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4 border-t-4 border-red-700">
          <div className="flex justify-between items-start mb-2">
            <label className="block text-sm font-semibold text-gray-700">
              Select Game Date
            </label>
            <button
              onClick={resetTable}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              Reset
            </button>
          </div>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 text-sm"
            dateFormat="MM/dd/yyyy"
          />
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
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
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
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden">
                {rows.map((row) => (
                  <SortableCard
                    key={row.id}
                    row={row}
                    onUpdate={updateRow}
                    onDelete={deleteRow}
                  />
                ))}
              </div>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={handleSaveCSV}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium shadow-sm"
          >
            Save CSV
          </button>
          <button
            onClick={handleImportCSV}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium shadow-sm"
          >
            Import CSV
          </button>
          <button
            onClick={handleEmailCSV}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium shadow-sm"
          >
            Email CSV
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors font-medium shadow-sm"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

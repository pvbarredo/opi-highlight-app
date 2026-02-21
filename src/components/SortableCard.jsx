import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';

export default function SortableCard({ row, onUpdate, onDelete, onTimeBlur }) {
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
      className={`border border-gray-200 rounded p-4 mb-3 ${
        row.isNew ? 'bg-yellow-50' : 'bg-white'
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="text-center text-sm font-semibold text-gray-600 bg-gray-100 rounded px-3 py-1">
          #{row.placement}
        </div>
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 touch-none"
        >
          <GripVertical size={24} />
        </button>
      </div>
      <div className="flex items-start gap-3">
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
              onBlur={(e) => onTimeBlur(row.id, e.target.value)}
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
        <div className="flex items-center">
          <button
            onClick={() => onDelete(row.id)}
            className="text-red-700 hover:text-red-900 transition-colors"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

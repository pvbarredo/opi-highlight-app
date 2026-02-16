import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';

export default function SortableTableRow({ row, onUpdate, onDelete, onTimeBlur }) {
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
          onBlur={(e) => onTimeBlur(row.id, e.target.value)}
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

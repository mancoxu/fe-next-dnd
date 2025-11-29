'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { PanelType } from './DraggablePanels';

interface PanelProps {
  panel: PanelType;
  onClose: () => void;
}

export default function Panel({ panel, onClose }: PanelProps) {
  const {
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: panel.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col min-w-[450px] flex-1 h-full bg-white border-r border-gray-200"
    >
      <div
        {...listeners}
        className="flex items-center justify-between px-4 py-3 border-b border-gray-200 cursor-grab active:cursor-grabbing"
      >
        <h2 className="text-lg font-medium text-gray-900">{panel.title}</h2>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <XMarkIcon className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      <div className="flex-1 p-4 bg-gray-50">
        {panel.title}
      </div>
    </div>
  );
}

'use client';

import { PanelType } from './DraggablePanels';

interface SidebarProps {
  panels: PanelType[];
  onTogglePanel: (id: string) => void;
}

export default function Sidebar({ panels, onTogglePanel }: SidebarProps) {
  return (
    <div className="flex flex-col w-20 bg-white border-r border-gray-200 shrink-0">
      {panels.map((panel) => {
        const Icon = panel.icon;
        return (
          <button
            key={panel.id}
            onClick={() => onTogglePanel(panel.id)}
            className={`flex flex-col items-center justify-center py-4 px-2 gap-1 border-b border-gray-200 transition-all hover:bg-gray-50 ${
              panel.isOpen ? 'text-gray-900' : 'text-gray-300'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs">{panel.title}</span>
          </button>
        );
      })}
    </div>
  );
}

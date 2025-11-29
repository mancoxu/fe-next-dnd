'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { MapIcon, MusicalNoteIcon, ChatBubbleBottomCenterIcon } from '@heroicons/react/24/outline';
import Sidebar from './Sidebar';
import Panel from './Panel';

export interface PanelType {
  id: string;
  title: string;
  icon: typeof MapIcon;
  isOpen: boolean;
}

export default function DraggablePanels() {
  const [panels, setPanels] = useState<PanelType[]>([
    { id: 'map', title: 'Map', icon: MapIcon, isOpen: true },
    { id: 'music', title: 'Music', icon: MusicalNoteIcon, isOpen: true },
    { id: 'chat', title: 'Chat', icon: ChatBubbleBottomCenterIcon, isOpen: true },
  ]);

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPanels((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const togglePanel = (id: string) => {
    setPanels((items) =>
      items.map((item) =>
        item.id === id ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  };

  const openPanels = panels.filter((panel) => panel.isOpen);

  return (
    <div className="flex h-full w-full">
      <Sidebar panels={panels} onTogglePanel={togglePanel} />

      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={openPanels.map((p) => p.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex h-full w-full">
              {openPanels.map((panel) => (
                <Panel
                  key={panel.id}
                  panel={panel}
                  onClose={() => togglePanel(panel.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
  MapIcon,
  MusicalNoteIcon,
  ChatBubbleBottomCenterIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "./Sidebar";
import Panel from "./Panel";

export interface PanelType {
  id: string;
  title: string;
  icon: typeof MapIcon;
  isOpen: boolean;
}

export default function DraggablePanels() {
  const [panels, setPanels] = useState<PanelType[]>([
    { id: "map", title: "Map", icon: MapIcon, isOpen: true },
    { id: "music", title: "Music", icon: MusicalNoteIcon, isOpen: true },
    {
      id: "chat",
      title: "Chat",
      icon: ChatBubbleBottomCenterIcon,
      isOpen: true,
    },
  ]);
  const [activeId, setActiveId] = useState<string | null>(null);

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

  const handleDragStart = (event: DragEndEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPanels((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  };

  const togglePanel = (id: string) => {
    setPanels((items) =>
      items.map((item) =>
        item.id === id ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  };

  const openPanels = panels.filter((panel) => panel.isOpen);
  const activePanel = activeId
    ? openPanels.find((p) => p.id === activeId)
    : null;

  return (
    <div className="flex h-full w-full">
      <Sidebar panels={panels} onTogglePanel={togglePanel} />

      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToHorizontalAxis]}
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
          <DragOverlay
            dropAnimation={{
              duration: 350,
              easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
          >
            {activePanel ? (
              <div className="flex flex-col min-w-[450px] flex-1 h-full bg-white border-r border-gray-200 opacity-80">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    {activePanel.title}
                  </h2>
                </div>
                <div className="flex-1 p-4 bg-gray-50">{activePanel.title}</div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}

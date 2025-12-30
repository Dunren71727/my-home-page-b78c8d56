import { useMemo } from 'react';
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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Service, Subcategory } from '@/types/dashboard';
import { DraggableServiceCard } from './DraggableServiceCard';

interface SubcategoryColumnProps {
  subcategory: Subcategory;
  services: Service[];
  onReorderServices: (services: Service[]) => void;
}

export function SubcategoryColumn({ subcategory, services, onReorderServices }: SubcategoryColumnProps) {
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

  const sortedServices = useMemo(() => {
    return [...services].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [services]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedServices.findIndex((s) => s.id === active.id);
      const newIndex = sortedServices.findIndex((s) => s.id === over.id);

      const newOrder = [...sortedServices];
      const [removed] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, removed);

      const updatedServices = newOrder.map((s, index) => ({ ...s, order: index }));
      onReorderServices(updatedServices);
    }
  };

  if (sortedServices.length === 0) return null;

  return (
    <div className="rounded-xl p-5 min-w-[300px] h-fit bg-muted/40 border border-border/50 backdrop-blur-sm hover-float">
      {/* 子分類標題 - 繽紛漸層 */}
      <h3 className="font-bold text-base mb-5 pb-3 border-b-2 border-gradient-to-r from-primary to-secondary tracking-wide 
        bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        ✦ {subcategory.name}
      </h3>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sortedServices.map(s => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {sortedServices.map((service, index) => (
              <DraggableServiceCard 
                key={service.id} 
                service={service}
                index={index}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
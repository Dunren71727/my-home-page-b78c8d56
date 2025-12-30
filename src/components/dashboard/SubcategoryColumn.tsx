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

      // Update order values
      const updatedServices = newOrder.map((s, index) => ({ ...s, order: index }));
      onReorderServices(updatedServices);
    }
  };

  if (sortedServices.length === 0) return null;

  return (
    <div 
      className="rounded-xl p-4 min-w-[280px] h-fit"
      style={{ 
        backgroundColor: `color-mix(in srgb, ${subcategory.color} 8%, hsl(var(--card)))`,
        border: `1px solid color-mix(in srgb, ${subcategory.color} 15%, transparent)`
      }}
    >
      <h3 className="font-semibold text-base mb-4" style={{ color: subcategory.color }}>
        {subcategory.name}
      </h3>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sortedServices.map(s => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {sortedServices.map((service) => (
              <DraggableServiceCard 
                key={service.id} 
                service={service} 
                color={subcategory.color}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

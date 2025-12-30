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
  columnIndex?: number;
}

export function SubcategoryColumn({ subcategory, services, onReorderServices, columnIndex = 0 }: SubcategoryColumnProps) {
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

  // 子分類欄位明亮跳色
  const columnVariants = [
    'column-bg-1',
    'column-bg-2',
    'column-bg-3',
  ];
  const columnBg = columnVariants[columnIndex % columnVariants.length];

  return (
    <div className={`rounded-xl p-5 min-w-[360px] w-full h-fit backdrop-blur-sm hover-lift border border-bright-gold/15 ${columnBg}`}>
      {/* 子分類標題 - 深藍+亮金 */}
      <h3 className="font-bold text-base mb-5 pb-3 border-b-2 border-secondary/50 tracking-wide text-primary flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-secondary" />
        {subcategory.name}
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
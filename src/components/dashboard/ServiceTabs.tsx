import { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Category, Subcategory, Service } from '@/types/dashboard';
import { CategoryTabContent } from './CategoryTabContent';

interface ServiceTabsProps {
  categories: Category[];
  subcategories: Subcategory[];
  services: Service[];
  onReorderServices: (services: Service[]) => void;
}

export function ServiceTabs({ categories, subcategories, services, onReorderServices }: ServiceTabsProps) {
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [categories]);

  if (sortedCategories.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        尚無分類，請在設定中新增
      </div>
    );
  }

  return (
    <div className="matte-card rounded-lg overflow-hidden">
      <Tabs defaultValue={sortedCategories[0]?.id} className="w-full">
        {/* Tab header with brushed metal effect */}
        <div className="border-b border-border brushed-metal">
          <TabsList className="w-full justify-start h-auto p-0 bg-transparent rounded-none">
            {sortedCategories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="relative px-6 py-3.5 rounded-none border-b-2 border-transparent 
                  data-[state=active]:bg-card/80 data-[state=active]:border-current 
                  transition-all font-medium text-sm tracking-wide"
                style={{ 
                  color: category.color,
                  borderBottomWidth: '2px',
                }}
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {sortedCategories.map((category) => (
          <TabsContent 
            key={category.id} 
            value={category.id}
            className="mt-0 focus-visible:outline-none bg-card"
          >
            <CategoryTabContent
              category={category}
              subcategories={subcategories}
              services={services}
              onReorderServices={onReorderServices}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
